// Document Model
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DocumentSchema = schema({
  _id: schema.Types.ObjectId,
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    required: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
