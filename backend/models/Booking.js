const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, 
  status: { type: String, enum: ['scheduled', 'completed', 'paid'], default: 'scheduled' }, 
  paymentTransactionId: { type: String, required: false }, 
});

module.exports = mongoose.model('Booking', bookingSchema);
