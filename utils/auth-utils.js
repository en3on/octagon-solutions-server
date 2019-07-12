const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const mongoose = require('mongoose');

const {ValidationError, AuthenticationError} = require('./error-utils.js');

/**
 * generates hash for plaintext password
 * @param {String} password plaintext password
 * @return {String} hashed password
 */
async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * generates jsonwebtoken for user
 * @param {String} email unique email address for user
 * @return {String} jsonwebtoken
 */
function generateToken({email}) {
  return jwt.sign(email, process.env.JWT_SECRET);
};

/**
 * compares hased password with plaintext password
 * @param {String} password plaintext password
 * @param {String} hash hashed password
 * @return {Boolean} outcome of comparing the two params
 */
async function comparePassword(password, hash) {
  if (await bcrypt.compare(password, hash)) {
    return true;
  }

  throw new AuthenticationError(400, 'Username or Password is incorrect!');
};

/**
 * validates password against set rules
 * @param {String} password plaintext password
 */
function validatePassword(password) {
  const regexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;

  const valid = regexp.test(password);

  if (!valid) {
    throw new ValidationError(
        400,
        'Please ensure your password satisfies the following',
        [
          'At least 1 Uppercase Letter',
          'At least 1 Lowercase Letter',
          'At least 1 Number',
        ]
    );
  }
}
/**
 * validates email against regexp
 * @param {String} email email address
 */
function validateEmail(email) {
  const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const valid = regexp.test(email);

  if (!valid) {
    throw new ValidationError(400, 'Please enter a valid email address');
  }
}

/**
 * description
 * @param {Object} user user object
 * @return {Object} User object
 */
async function generateUser(user) {
  const {firstName, lastName, email, password: plainPassword} = user;
  validatePassword(plainPassword);
  validateEmail(email);

  const password = await generateHash(plainPassword);

  const newUser = new User({firstName, lastName, email, password});

  newUser._id = new mongoose.Types.ObjectId();

  return await newUser.save();
};

module.exports = {
  generateUser,
  generateToken,
  comparePassword,
};
