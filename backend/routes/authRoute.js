const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Inscription d'un utilisateur
router.post('/register', async (req, res) => {
  console.log("Received POST request to /register");
  const { name, email, subject, password, bio, role } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Création d'un nouvel utilisateur
    user = new User({
      name,
      email,
      subject,
      password,
      bio,
      role,
    });

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();

    // Génération du token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route POST pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

    console.log('Email envoyé:', email); // Vérifie que l'email est reçu
    console.log('Mot de passe envoyé:', password); // Vérifie que le mot de passe est reçu

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Si les identifiants sont corrects, générer un token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retourner le token JWT au client
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
