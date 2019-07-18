const express = require('express');
const router = new express.Router();
const {register, login, forgotPassword} = require('../controllers/auth-controller.js');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);

module.exports = router;
