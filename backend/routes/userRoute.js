const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const checkAdmin = require('../middleware/checkAdmin');
const multer = require('multer');
const stripe = require('stripe')('sk_test_51LmhGsHQanXHoJn0RTN8E60pZA6VlweUCRsEKA5o0Xwnucm1UKCNRJGwUYgXXcPajVgfjRp3GgUIme0HbeSGZkR300dtVCPlyy'); // Votre clé Stripe



// Configuration de multer pour stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route protégée pour mettre à jour le profil utilisateur
router.post('/updateProfile', [auth, upload.single('profilePicture')], async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'utilisateur à partir du middleware auth
    const { name, email, password } = req.body;
    let updateData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateData.profilePicture = req.file.filename; // Ajouter l'image si elle existe
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ message: 'Profil mis à jour avec succès', user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
});

// Route pour récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des informations du profil' });
  }
});






// Route protégée pour récupérer tous les utilisateurs (accessible uniquement aux admins)
router.get('/users', auth, async (req, res) => {
  try {
    // Récupérer tous les utilisateurs dans la base de données
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Créer un professeur
router.post('/createProfessor', [auth, checkAdmin], async (req, res) => {
  const { name, email, subject, password, bio } = req.body;

  if (!bio || !subject) {
    return res.status(400).json({ message: 'Les champs biographie et matière sont obligatoires pour un professeur.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Créer un compte Stripe Connect
    const stripeAccount = await stripe.accounts.create({
      type: 'express',
      email: email,
    });

    if (!stripeAccount || !stripeAccount.id) {
      return res.status(500).json({ message: 'Erreur lors de la création du compte Stripe.' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      name,
      email,
      subject,
      password,
      bio,
      role: 'professor',
      stripeAccountId: stripeAccount.id,
    });

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'Professeur créé avec succès', user });
  } catch (err) {
    console.error('Erreur lors de la création du professeur :', err.message);
    res.status(500).json({ message: 'Erreur lors de la création du professeur' });
  }
});



// Route pour récupérer tous les utilisateurs avec le rôle "professor"
router.get('/professors', async (req, res) => {
  try {
    const professors = await User.find({ role: 'professor' });
    res.json(professors);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des professeurs' });
  }
});

// Route pour récupérer les détails d'un utilisateur par son ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du professeur' });
  }
});


module.exports = router;
