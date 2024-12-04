const express = require('express');
const User = require('../models/User');
const Conversation = require('../models/Conversation'); // Modèle de conversation
const Appointment = require('../models/Appointment'); // Modèle de rendez-vous
const auth = require('../middleware/auth');
const router = express.Router();

// Route pour compter les utilisateurs
router.get('/users', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ total: totalUsers });
  } catch (err) {
    console.error('Erreur lors du comptage des utilisateurs:', err);
    res.status(500).json({ message: 'Erreur serveur lors du comptage des utilisateurs.' });
  }
});

// Route pour compter les conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    res.status(200).json({ total: totalConversations });
  } catch (err) {
    console.error('Erreur lors du comptage des conversations:', err);
    res.status(500).json({ message: 'Erreur serveur lors du comptage des conversations.' });
  }
});

// Route pour compter les rendez-vous
router.get('/appointments', auth, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    res.status(200).json({ total: totalAppointments });
  } catch (err) {
    console.error('Erreur lors du comptage des rendez-vous:', err);
    res.status(500).json({ message: 'Erreur serveur lors du comptage des rendez-vous.' });
  }
});

module.exports = router;
