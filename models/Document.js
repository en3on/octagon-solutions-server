// Document Model
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DocumentModel = schema({
  _id: schema.Types.ObjectId,
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = ('Document', DocumentModel);
