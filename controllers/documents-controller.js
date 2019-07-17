const Document = require('../models/Document.js');
const User = require('../models/User.js');
const {verifyToken} = require('../utils/auth-utils.js');
const mongoose = require('mongoose');

const {ValidationError} = require('../utils/error-utils.js');
const uploadFile = require('../utils/file-uploader.js');

async function uploadHandler(req, res, next) {
  const {token} = req.headers;
  const {files} = req;
  const {descriptions} = req.body;

  try {
    if (!files) {
      throw new ValidationError(400,
          'No files were provided! Please try again!');
    }
    let user = verifyToken(token);

    user = await User.findOne({email: user});

    // create document and assign it to user
    for (i = 0; i < files.length; i++) {
      const resp = await uploadFile(files[i].buffer);

      const newDocument = new Document({
        _id: new mongoose.Types.ObjectId(),
        url: resp.secure_url,
        publicId: resp.public_id,
        description: descriptions[i],
        timeCreated: new Date(resp.created_at),
      });

      await newDocument.save();

      await user.documents.push(newDocument.id);
    }

    await user.save();

    return res.status(201).json({
      message: 'Documents uploaded successfully!',
    });
  } catch (err) {
    next(err);
  };
}

async function deleteHandler(req, res, next) {
  try {
    const {token} = req.headers;
    const {publicId} = req.params;

    let user = verifyToken(token);
    user = await User.findOne({email: user}).populate('documents');

    const foundDocument =
        user.documents.find((doc) => doc.publicId === publicId);

    if (!foundDocument) {
      const error = new Error('Not Found!');
      error.status = 404;

      throw error;
    }

    foundDocument.delete = true;

    await foundDocument.save();

    return res.status(200).send('Document successfully scheduled for deletion');
  } catch (err) {
    next(err);
  };
};

module.exports = {
  uploadHandler,
  deleteHandler,
};
