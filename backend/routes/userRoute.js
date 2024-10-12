const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();


// Récupérer tous les professeurs
router.get('/professors', auth, async (req, res) => {
  try {
    const professors = await User.find({ role: 'professor' });
    res.json(professors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
