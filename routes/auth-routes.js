const express = require('express');
const router = new express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getNotifications,
  deleteNotification,
}
  = require('../controllers/auth-controller.js');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/passwordChange', resetPassword);
router.post('/getNotifications', getNotifications);
router.post('/deleteNotification', deleteNotification);

module.exports = router;
