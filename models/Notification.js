// Notification Model
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const NotificationSchema = schema({
  _id: schema.Types.ObjectId,
  userId: {
    type: schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
