const Document = require('../models/Document.js');
const {verifyToken} = require('../utils/auth-utils.js');

async function upload(req, res, next) {
  const {token} = req.body;

  try {
    const user = verifyToken(token);

    // create document and assign it to user
  } catch (err) {
    next(err);
  };
}

module.exports = {
  upload,
};
