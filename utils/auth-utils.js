const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const ResetPassLink = require('../models/ResetPassLink.js');
const mongoose = require('mongoose');
const randomString = require('randomstring');

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

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AuthenticationError(401,
        'You are not logged in! Please log in to upload documents!');
  }
}

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
  const regexp = /\b[\w.%-]+@[\w.-]+\.[a-z]{2,}\b/;

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

function generateAuthString() {
  return randomString.generate({
    length: 16,
    charset: 'alphanumeric',
  });
}

async function validateAuthString(authStr) {
  const resetPassLink = await ResetPassLink.findOne({value: authStr}).populate('User');

  if (resetPassLink === null) {
    const err = new Error('Link not found!');
    err.status = 404;

    throw err;
  }

  if (resetPassLink.expiry < new Date(Date.now())) {
    const err = new Error('Link Expired!');
    err.status = 403;

    throw err;
  };

  return await User.findOne({_id: resetPassLink.userId});
};

function generateResetPassLink(user) {
  return new ResetPassLink({
    _id: new mongoose.Types.ObjectId(),
    value: generateAuthString(),
    expiry: new Date(Date.now() + 1800000),
    userId: user.id,
  });
};

module.exports = {
  generateUser,
  generateToken,
  generateHash,
  comparePassword,
  verifyToken,
  generateResetPassLink,
  validateAuthString,
};
