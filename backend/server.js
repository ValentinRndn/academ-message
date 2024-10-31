const express = require('express');
const http = require('http');
const cors = require('cors'); // Import du middleware cors
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à MongoDB
require('dotenv').config();

// Import des modèles
const Conversation = require('./models/Conversation');

dotenv.config();
connectDB(); // Connexion à MongoDB

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // L'origine de ton frontend Vue.js
    methods: ['GET', 'POST'] // Méthodes HTTP autorisées
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // L'origine de ton frontend Vue.js
  methods: 'GET,POST,PUT,DELETE', // Méthodes HTTP autorisées
  credentials: true // Si tu veux envoyer des cookies (optionnel)
}));

app.use(express.json()); // Middleware pour traiter les JSON

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute')); // Route des utilisateurs
app.use('/api/conversations', require('./routes/conversationRoute')); // Route des conversations
app.use('/uploads', express.static('uploads'));
app.use('/api/payment', require('./routes/payment')); 
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
