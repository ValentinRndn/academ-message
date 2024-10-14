const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const checkAdmin = require('../middleware/checkAdmin');


// Route protégée pour récupérer tous les utilisateurs (accessible uniquement aux admins)
router.get('/users', auth, async (req, res) => {
  try {
    // // Vérifie si l'utilisateur connecté est un administrateur (optionnel)
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    // Récupérer tous les utilisateurs dans la base de données
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route pour permettre à un admin de créer un professeur
router.post('/createProfessor', [auth, checkAdmin], async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Créer un nouvel utilisateur avec le rôle de professeur
    user = new User({
      name,
      email,
      password,
      role: 'professor' // Spécifier le rôle de professeur
    });

    // Hashage du mot de passe avant de sauvegarder
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();

    res.status(201).json({ message: 'Professor created successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route GET pour récupérer des informations utilisateurs protégée par JWT
router.get('/profile', auth, (req, res) => {
  res.json({ message: `User profile for ID ${req.user.id}` });
});

module.exports = router;
