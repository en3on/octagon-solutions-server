// User schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  _id: Schema.Types.ObjectId,
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {type: String},
  last_name: {
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
});

module.exports = mongoose.model('User', UserSchema);
