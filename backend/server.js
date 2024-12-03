const express = require('express');
const http = require('http');
const cors = require('cors'); 
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
require('dotenv').config();

// Import des modèles
const Conversation = require('./models/Conversation');

dotenv.config();
connectDB(); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'] 
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute')); 
app.use('/api/conversations', require('./routes/conversationRoute')); 
app.use('/uploads', express.static('uploads'));
app.use('/api/booking', require('./routes/bookingRoutes')); 
app.use('/public', express.static('public'));


io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Utilisateur a rejoint la conversation : ${conversationId}`);
  });

  socket.on('new-message', async ({ conversationId, message }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
  
      if (conversation) {
        // Vérifiez si un message identique existe
        const isDuplicate = conversation.messages.some(
          msg => msg.text === message.text && msg.sender.toString() === message.sender
        );
        if (isDuplicate) {
          return;
        }
  
        conversation.messages.push({
          sender: message.sender,
          text: message.text,
          createdAt: new Date(),
        });
        await conversation.save();
  
        io.to(conversationId).emit('message-received', { conversationId, message });
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
  });
  


  // Événement : L'utilisateur est en train d'écrire
  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('user-typing', userId); // Émettre à tous sauf à l'expéditeur
  });

  // Événement : L'utilisateur a arrêté d'écrire
  socket.on('stop-typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('user-stopped-typing', userId);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
