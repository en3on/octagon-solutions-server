// Document Model
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DocumentSchema = schema({
  _id: schema.Types.ObjectId,
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time_created: {
    type: Date,
    required: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
