const Document = require('../models/Document.js');
const User = require('../models/User.js');
const {verifyToken} = require('../utils/auth-utils.js');
const mongoose = require('mongoose');

const {ValidationError, AuthenticationError} = require('../utils/error-utils.js');
const uploadFile = require('../utils/file-uploader.js');

/**
 * Creates new Document object and assigns it to a validated user
 * @param {Object} req Post request
 * @param {Object} res Response object
 * @param {Function} next Error Handler
 * @return {Obejct} Server response object
 */
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

/**
 * Handles deletion of a user's document for a validated user
 * @param {Object} req Post request
 * @param {Object} res Response object
 * @param {Function} next Error Handler
 * @return {Obejct} Server response object
 */
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
    } else if (foundDocument.delete) {
      const error = new Error('Document already marked for deletion!');
      error.status = 400;

      throw error;
    }

    foundDocument.delete = true;

    await foundDocument.save();

    return res.status(200).send('Document successfully scheduled for deletion');
  } catch (err) {
    next(err);
  };
};

async function getUserDocuments(req, res, next) {
  try {
    const {token} = req.headers;
    const {userId} = req.params;

    let user = verifyToken(token);
    user = await User.findOne({email: user});

    const requestedUser = await User.findOne({id: userId}).populate('documents');

    if (user.id !== requestedUser.id && !user.admin) {
      throw new AuthenticationError(403,
          'You are not authorized to view that user\'s documents!');
    }

    res.status(200).json({
      documents: requestedUser.documents,
    });
  } catch (err) {
    next(err);
  };
};

module.exports = {
  uploadHandler,
  deleteHandler,
  getUserDocuments,
};
