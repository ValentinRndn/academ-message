const express = require('express');
const http = require('http');
const cors = require('cors'); // Import du middleware cors
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à MongoDB

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

const conversations = {};

// Socket.IO pour gérer les messages en temps réel
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté:', socket.id);

  // Rejoindre une conversation
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Utilisateur ${socket.id} a rejoint la conversation: ${conversationId}`);
  });

  // Recevoir un nouveau message
  socket.on('new-message', ({ conversationId, message }) => {
    console.log(`Nouveau message dans la conversation ${conversationId}:`, message);

    // Sauvegarder le message dans la conversation (simuler)
    if (!conversations[conversationId]) {
      conversations[conversationId] = [];
    }
    conversations[conversationId].push(message);

    // Émettre le message à tous les utilisateurs de la conversation
    io.to(conversationId).emit('message-received', message);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté:', socket.id);
  });
});


// Configuration de CORS pour autoriser l'origine http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // L'origine de ton frontend Vue.js
  methods: 'GET,POST,PUT,DELETE', // Méthodes HTTP autorisées
  credentials: true // Si tu veux envoyer des cookies (optionnel)
}));

app.use(express.json()); // Middleware pour traiter les JSON

// Routes
app.use('/api/auth', require('./routes/authRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
