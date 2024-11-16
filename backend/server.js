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

// Socket.IO pour gérer les messages en temps réel
io.on('connection', (socket) => {

  // Rejoindre une conversation
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Recevoir un nouveau message
  socket.on('new-message', async ({ conversationId, message }) => {

    try {
      // Rechercher la conversation par ID
      const conversation = await Conversation.findById(conversationId);

      if (conversation) {
        // Ajouter le message à la conversation
        conversation.messages.push({
          sender: message.sender, // ID de l'utilisateur envoyant le message
          text: message.text,
          createdAt: new Date(),
        });

        await conversation.save(); // Sauvegarder la conversation

        // Émettre le message à tous les utilisateurs de la conversation
        io.to(conversationId).emit('message-received', message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
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
