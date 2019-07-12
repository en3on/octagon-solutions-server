const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const mongoose = require('mongoose');

const {ValidationError, AuthenticationError} = require('./error-utils.js');

async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

function generateToken({email}) {
  return jwt.sign(email, process.env.JWT_SECRET);
};

async function comparePassword(password, hash) {
  if (await bcrypt.compare(password, hash)) {
    return true;
  }

  throw new AuthenticationError(400, 'Username or Password is incorrect!');
};

function validatePassword(password) {
  const regexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;

  const valid = regexp.test(password);

  if (!valid) {
    throw new ValidationError(400, 'Please ensure your password satisfies the following', [
      'At least 1 Uppercase Letter',
      'At least 1 Lowercase Letter',
      'At least 1 Number',
    ]);
  }
}

function validateEmail(email) {
  const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const valid = regexp.test(email);

  if (!valid) {
    throw new ValidationError(400, 'Please enter a valid email address');
  }
}


async function generateUser(firstName, lastName, email, plainPassword) {
  validatePassword(plainPassword);
  validateEmail(email);

  const password = await generateHash(plainPassword);

  const newUser = new User({firstName, lastName, email, password});

  newUser._id = mongoose.Types.ObjectId();

  return await newUser.save();
};

module.exports = {
  generateUser,
  generateToken,
  comparePassword,
};
