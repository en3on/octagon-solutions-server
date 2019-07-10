const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const mongoose = require('mongoose');

async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

async function generateUser(firstName, lastName, email, plainPassword) {
  const password = await generateHash(plainPassword);

  const newUser = new User({firstName, lastName, email, password});

  newUser._id = mongoose.Types.ObjectId();

  return await newUser.save();
};

module.exports = {
  generateUser,
};
