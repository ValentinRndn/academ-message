const express = require('express');
const stripe = require('stripe')('sk_test_51LmhGsHQanXHoJn0RTN8E60pZA6VlweUCRsEKA5o0Xwnucm1UKCNRJGwUYgXXcPajVgfjRp3GgUIme0HbeSGZkR300dtVCPlyy'); // Votre clé Stripe
const schedule = require('node-schedule');
const router = express.Router();

router.post('/schedule-payment', async (req, res) => {
  try {
    const { bookingDate, bookingTime, amount, currency, professorStripeAccountId } = req.body;

    console.log('Requête reçue :', { bookingDate, bookingTime, amount, currency, professorStripeAccountId });

    // Validation des données
    if (!bookingDate || !bookingTime || !amount || !currency || !professorStripeAccountId) {
      console.error('Erreur : Données manquantes ou invalides');
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      console.error('Erreur : Montant invalide');
      return res.status(400).json({ error: 'Le montant doit être un entier positif (en centimes).' });
    }

    // Calculer la date/heure de paiement : 1 heure après la réservation
    const paymentDate = new Date(`${bookingDate}T${bookingTime}:00Z`);
    paymentDate.setHours(paymentDate.getHours() + 1);

    console.log('Paiement différé prévu pour :', paymentDate.toISOString());

    // Vérifiez si la date est dans le futur
    if (paymentDate <= new Date()) {
      console.error('Erreur : La date de paiement doit être dans le futur.');
      return res.status(400).json({ error: 'La date de paiement doit être dans le futur.' });
    }

    // Planifier le paiement différé
    const job = schedule.scheduleJob(paymentDate, async () => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          application_fee_amount: 500, // 5 € pour la plateforme
          transfer_data: {
            destination: professorStripeAccountId,
          },
        });
        console.log('Paiement effectué avec succès :', paymentIntent.id);
      } catch (error) {
        console.error('Erreur lors du paiement différé Stripe :', error.message);
      }
    });

    if (job) {
      console.log('Tâche planifiée avec succès :', job.nextInvocation());
      res.json({ message: 'Paiement programmé avec succès.' });
    } else {
      console.error('Erreur : La planification du paiement a échoué.');
      res.status(500).json({ error: 'La planification du paiement a échoué.' });
    }
  } catch (error) {
    console.error('Erreur lors de la programmation du paiement :', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;