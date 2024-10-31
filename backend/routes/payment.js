const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51LmhGsHQanXHoJn0RTN8E60pZA6VlweUCRsEKA5o0Xwnucm1UKCNRJGwUYgXXcPajVgfjRp3GgUIme0HbeSGZkR300dtVCPlyy');
const cron = require('node-cron');

let scheduledPayments = {};

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, professorStripeAccountId, bookingDate, bookingTime } = req.body;

        if (!amount || !currency || !professorStripeAccountId || !bookingDate || !bookingTime) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Crée le Payment Intent avec des frais d'application et transfert de fonds au professeur
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            application_fee_amount: 500, // Frais de 5 euros pour le propriétaire de la plateforme
            transfer_data: {
                destination: professorStripeAccountId,
            },
            capture_method: 'manual', // Mode de capture manuel
        });

        // Programmez la capture de paiement une heure après l'heure de réservation
        const scheduledTime = new Date(`${bookingDate}T${bookingTime}`);
        scheduledTime.setHours(scheduledTime.getHours() + 1); // Ajoute 1 heure

        const paymentIntentId = paymentIntent.id;
        const task = cron.schedule(scheduledTime, async () => {
            try {
                await stripe.paymentIntents.capture(paymentIntentId);
                console.log(`Paiement capturé pour le Payment Intent : ${paymentIntentId}`);
            } catch (error) {
                console.error(`Erreur lors de la capture du paiement pour ${paymentIntentId}:`, error);
            }
        });

        // Stocke la tâche pour référence
        scheduledPayments[paymentIntentId] = task;

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Erreur lors de la création du Payment Intent:', error);
        res.status(500).json({ error: 'Échec de la création du Payment Intent' });
    }
});

// Route pour annuler une capture de paiement programmée (si besoin)
router.post('/cancel-scheduled-payment', (req, res) => {
    const { paymentIntentId } = req.body;
    const task = scheduledPayments[paymentIntentId];
    if (task) {
        task.stop();
        delete scheduledPayments[paymentIntentId];
        res.status(200).json({ message: 'Paiement différé annulé.' });
    } else {
        res.status(404).json({ message: 'Aucun paiement programmé trouvé pour cet ID.' });
    }
});

module.exports = router;
