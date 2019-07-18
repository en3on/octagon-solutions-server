// User schema
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = schema({
  _id: schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPassLink: {
    type: Object,
    default: null,
  },
  documents: [{type: schema.Types.ObjectId, ref: 'Document'}],
});

module.exports = mongoose.model('User', UserSchema);
