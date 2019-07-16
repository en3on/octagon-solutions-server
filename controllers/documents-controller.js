const Document = require('../models/Document.js');
const User = require('../models/User.js');
const {verifyToken} = require('../utils/auth-utils.js');
const mongoose = require('mongoose');

const uploadFile = require('../utils/file-uploader.js');

async function uploadHandler(req, res, next) {
  const {token} = req.headers;
  const {files} = req;
  const {descriptions} = req.body;
  // console.log({token, descriptions, files});

  try {
    let user = verifyToken(token);

    user = await User.findOne({email: user});

    // create document and assign it to user
    for (i = 0; i < files.length; i++) {
      const resp = await uploadFile(files[i].buffer);

      const newDocument = new Document({
        _id: new mongoose.Types.ObjectId(),
        url: resp.secure_url,
        description: descriptions[i],
      });

      await newDocument.save();

      await user.documents.push(newDocument.id);
    }

    await user.save();

    return res.status(201).json({
      message: 'Documents saved successfully!',
    });
  } catch (err) {
    next(err);
  };
}

module.exports = {
  uploadHandler,
};
