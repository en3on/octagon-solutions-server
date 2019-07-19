const cloudinary = require('../config/cloudinary.js');

/**
 * Uploads file to cloudinary
 * @param {Object} fileBuffer Raw buffer of the file
 * @return {Promise} Outcome of upload
 */
function uploadFile(fileBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
        {resource_type: 'raw'},
        (err, response) => {
          if (err) reject(err.response);
          resolve(response);
        }
    ).end(fileBuffer);
  });
}

module.exports = uploadFile;
