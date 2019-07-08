const mongoose = require('mongoose');
const schema = mongoose.Schema;

const PackageSchema = schema({
  _id: schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  booking_id: {
    type: schmea.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
});

module.exports = mongoose.model('Package', PackageSchema);
