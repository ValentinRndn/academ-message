const express = require('express');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const router = express.Router();

// Récupérer les conversations de l'utilisateur connecté
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    }).populate([
      {
        path: 'participants',
        select: 'name email stripeAccountId role profilePicture', // Inclure profilePicture
      },
      {
        path: 'messages.sender',
        select: 'name email profilePicture', // Inclure profilePicture
      },
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
  }
});
 

// Créer une nouvelle conversation
router.post('/', async (req, res) => {
  const { participants } = req.body;

  // Log pour vérifier les participants
  console.log('Participants reçus :', participants);

  // Vérifier que les participants sont bien deux ID distincts
  if (!participants || participants.length !== 2 || participants[0] === participants[1]) {
    return res.status(400).json({ message: 'Les participants doivent être deux utilisateurs distincts.' });
  }

  try {
    // Créer la nouvelle conversation
    const newConversation = new Conversation({
      participants,
      messages: []
    });

    const savedConversation = await newConversation.save();

    // Log pour vérifier la conversation créée
    console.log('Conversation créée :', savedConversation);

    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Erreur lors de la création de la conversation :', error);
    res.status(500).json({ message: 'Erreur interne lors de la création de la conversation' });
  }
});

// routes/conversationRoute.js
router.post('/:id/message', async (req, res) => {
  const { senderId, text } = req.body;

  if (!senderId || !text) {
    return res.status(400).json({ message: 'Le senderId et le texte du message sont requis.' });
  }

  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Ajouter le message
    const newMessage = {
      sender: senderId,
      text,
      createdAt: new Date(),
    };
    conversation.messages.push(newMessage);
    await conversation.save();

    // Retournez uniquement le message ajouté
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message :', error);
    res.status(500).json({ message: 'Erreur interne lors de l\'ajout du message' });
  }
});



module.exports = router;
