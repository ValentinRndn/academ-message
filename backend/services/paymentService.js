// services/paymentService.js
const cron = require('node-cron');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Fonction pour planifier la capture du paiement
function schedulePaymentCapture(paymentIntentId) {
    const captureTime = new Date(Date.now() + 60 * 60 * 1000); // 1 heure après
    
    // Utilise node-cron pour planifier la capture
    const job = cron.schedule(`0 ${captureTime.getHours()} ${captureTime.getDate()} ${captureTime.getMonth() + 1} *`, async () => {
        try {
            await stripe.paymentIntents.capture(paymentIntentId);
            console.log(`Paiement capturé pour ${paymentIntentId}`);
            job.stop(); // Arrête le cron job après capture
        } catch (error) {
            console.error(`Erreur lors de la capture du paiement: ${error.message}`);
        }
    });
}

module.exports = { schedulePaymentCapture };
