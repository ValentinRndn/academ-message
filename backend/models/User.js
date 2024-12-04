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
    default: '/public/images/default-profile.webp',
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'professor'],
    default: 'client',
  },
  stripeAccountId: {
    type: String,
    default: '',
    validate: {
      validator: function (value) {
        if (value && this.role !== 'professor') {
          return false;
        }
        return true;
      },
      message: 'Seuls les professeurs peuvent avoir un compte Stripe.',
    },
  },
  bio: {
    type: String,
    default: '',
    validate: {
      validator: function (value) {
        if (this.role === 'professor' && !value) {
          return false;
        }
        return true;
      },
      message: 'Les professeurs doivent fournir une biographie.',
    },
  },
  subject: {
    type: String,
    default: '',
    validate: {
      validator: function (value) {
        if (this.role === 'professor' && !value) {
          return false;
        }
        return true;
      },
      message: 'Les professeurs doivent spécifier une matière enseignée.',
    },
  },
});

module.exports = mongoose.model('User', UserSchema);
