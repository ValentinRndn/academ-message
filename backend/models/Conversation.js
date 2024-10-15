const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId], // Tableau d'ID des participants
    ref: 'User',
    required: true
  },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
