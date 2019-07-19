const express = require('express');
const router = new express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
}
  = require('../controllers/auth-controller.js');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/passwordChange', resetPassword);

module.exports = router;
