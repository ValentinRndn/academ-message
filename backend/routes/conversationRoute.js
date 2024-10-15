const express = require('express');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const router = express.Router();

// Récupérer les conversations de l'utilisateur connecté
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    }).populate('participants messages.sender', 'name email');
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
  }
});

// Créer une nouvelle conversation
router.post('/', async (req, res) => {
  const { userId, recipientId, message } = req.body;

  try {
    let conversation = new Conversation({
      participants: [userId, recipientId],
      messages: [{ sender: userId, text: message }],
    });

    conversation = await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la conversation' });
  }
});

// Envoyer un message dans une conversation
router.post('/:conversationId/message', async (req, res) => {
  const { senderId, text } = req.body;

  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    conversation.messages.push({ sender: senderId, text });
    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
});

module.exports = router;
