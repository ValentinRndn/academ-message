const express = require('express');
const cors = require('cors'); // Import du middleware cors
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connexion à MongoDB

dotenv.config();
connectDB(); // Connexion à MongoDB

const app = express();

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
