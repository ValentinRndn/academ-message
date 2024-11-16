const express = require('express');
const stripe = require('stripe')('sk_test_51LmhGsHQanXHoJn0RTN8E60pZA6VlweUCRsEKA5o0Xwnucm1UKCNRJGwUYgXXcPajVgfjRp3GgUIme0HbeSGZkR300dtVCPlyy'); // Remplacez par votre clé secrète
const router = express.Router();

const schedule = require('node-schedule');

// Planifie un paiement différé
router.post('/schedule-payment', async (req, res) => {
  try {
    const { bookingDate, bookingTime, amount, currency, professorStripeAccountId } = req.body;

    // Calculer l'heure de paiement : une heure après la date/heure de réservation
    const paymentDate = new Date(`${bookingDate}T${bookingTime}`);
    paymentDate.setHours(paymentDate.getHours() + 1);

    // Planifier la tâche
    schedule.scheduleJob(paymentDate, async () => {
      try {
        await stripe.paymentIntents.create({
          amount,
          currency,
          application_fee_amount: 500, // 5 euros pour la plateforme
          transfer_data: {
            destination: professorStripeAccountId,
          },
        });
        console.log('Paiement effectué avec succès.');
      } catch (error) {
        console.error('Erreur lors du paiement différé:', error);
      }
    });

    res.json({ message: 'Paiement programmé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la programmation du paiement:', error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;