const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png', // Image par défaut si l'utilisateur n'en télécharge pas
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'professor'],
    default: 'client',
  },
  stripeAccountId: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', UserSchema);
