// Exemple de création de session avec Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Session = require('../models/Session');

const createSession = async (req, res) => {
  try {
    const { studentId, professorId, scheduledDate, amount } = req.body;

    // Créer une intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (amount + 5) * 100, // Inclut les frais de plateforme de 5€
      currency: 'eur',
      payment_method_types: ['card'],
    });

    // Créer une session dans la base de données
    const session = new Session({
      studentId,
      professorId,
      scheduledDate,
      amount,
      paymentIntentId: paymentIntent.id,
    });

    await session.save();
    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
};
