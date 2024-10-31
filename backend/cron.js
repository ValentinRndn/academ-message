//     // cron.js
// const cron = require('node-cron');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Session = require('./models/Session'); // Modèle pour les sessions de cours

// // Tâche cron planifiée pour capturer les paiements des sessions terminées
// cron.schedule('0 * * * *', async () => {
//   try {
//     console.log('Lancement de la capture des paiements pour les sessions terminées...');
    
//     // Récupérer les sessions terminées mais non payées
//     const sessions = await Session.find({ isCompleted: true, isPaid: false });

//     for (const session of sessions) {
//       // Capturer le paiement de la session
//       await stripe.paymentIntents.capture(session.paymentIntentId, {
//         amount_to_capture: session.amount * 100 + 500, // Total + frais de 5 euros
//       });

//       // Marquer la session comme payée
//       session.isPaid = true;
//       await session.save();
//     }

//     console.log('Paiements capturés avec succès pour les sessions terminées.');
//   } catch (error) {
//     console.error('Erreur lors de la capture des paiements:', error);
//   }
// });
