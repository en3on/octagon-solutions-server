const express = require('express');
const router = new express.Router();

const Mailer = require('../utils/mailer.js');

const User = require('../models/User.js');

router.use('/hello', (req, res) => {
  return res.send('Hello World!');
});

router.use('/mailer', async (req, res, next) => {
  try {
    const user = await User.findOne({email: 'adamladellsing@gmail.com'});
    await new Mailer(user).forgotPassword();
  } catch (err) {
    console.log({err});
    next(err);
  }
});

module.exports = router;
