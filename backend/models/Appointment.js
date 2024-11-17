const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  professorStripeAccountId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  status: { type: String, default: 'scheduled' }, // Status: scheduled, completed, failed
});

module.exports = mongoose.model('Appointment', appointmentSchema);
