const express = require('express');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');
const router = express.Router();

// Créer une conversation
router.post('/create', auth, async (req, res) => {
  const { participants } = req.body;
  try {
    const conversation = new Conversation({ participants });
    await conversation.save();
    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
