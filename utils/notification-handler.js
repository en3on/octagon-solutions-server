const Notification = require('../models/Notification.js');
const mongoose = require('mongoose');

async function NotificationHandler(user, type) {
  let message;
  let status;
  const userName = `${user.firstName} ${user.lastName} `;

  switch (type) {
    case 'DocUpload':
      message = userName + 'uploaded a new document';
      status = 'Documents';
      break;
    case 'DocDelete':
      message = userName + 'deleted a document';
      status = 'Documents';
      break;
    case 'UserRegister':
      message = userName + 'signed up';
      status = 'Users';
      break;
  };

  try {
    const notification = new Notification({
      _id: new mongoose.Types.ObjectId(),
      userId: user.id,
      message: message,
      status: status,
    });

    notification.save();
  } catch (err) {
    throw (err);
  }
}

module.exports = {NotificationHandler};
