const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); 
  }
};
module.exports = connectDB;
