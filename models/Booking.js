const mongoose = require('mongoose');
const schema = mongoose.Schema;

const BookingSchema = schema({
  _id: Schema.Types.ObjectId,
  date_time: {
    type: Date,
    required: true,
  },
  user_id: {
    type: Schame.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
