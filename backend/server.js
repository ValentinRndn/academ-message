const express = require('express');
const http = require('http');
const cors = require('cors'); 
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const fs = require('fs');
const https = require('https');
require('dotenv').config();
  
// Import des modèles
const Conversation = require('./models/Conversation');

dotenv.config();
connectDB(); 

const app = express();


// const privateKey = fs.readFileSync('./ssl/private.key', 'utf8'); 
// const certificate = fs.readFileSync('./ssl/cert.pem', 'utf8'); 
// const ca = fs.readFileSync('./ssl/ca.pem', 'utf8'); 

// const credentials = { key: privateKey, cert: certificate, ca: ca };

// const server = https.createServer(credentials, app);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'] 
  }
});

// Middleware
app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute')); 
app.use('/api/conversations', require('./routes/conversationRoute')); 
app.use('/api/statistics', require('./routes/statisticsRoute'));
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
    console.log('Événement new-message reçu :', { conversationId, message });
  
    try {
      const conversation = await Conversation.findById(conversationId);
  
      if (!conversation) {
        console.error('Conversation non trouvée pour new-message');
        return;
      }
  
      // Ne pas resauvegarder le message, mais émettre l'événement
      console.log('Message émis aux autres clients via Socket.IO');
      io.to(conversationId).emit('message-received', { conversationId, message });
    } catch (error) {
      console.error('Erreur lors de la gestion du message via Socket.IO:', error);
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
