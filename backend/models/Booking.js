const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Booking', BookingSchema);
