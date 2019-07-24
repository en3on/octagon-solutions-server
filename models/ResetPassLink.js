// ResetPassLink Model
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ResetPassLinkSchema = schema({
  _id: schema.Types.ObjectId,
  value: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    default: new Date(Date.now() + 1800000),
  },
  userId: {
    type: schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('ResetPassLink', ResetPassLinkSchema);
