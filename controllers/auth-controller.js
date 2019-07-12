const User = require('../models/User.js');
const {generateUser} = require('../utils/auth-utils.js');
const {ValidationError} = require('../utils/error-utils.js');

async function register(req, res) {
  const {firstName, lastName, email, password} = req.body;
  if (firstName && lastName && email && password) {
    try {
      const query = await User.findOne({email});

      if (query === null) {
        const user = await generateUser(firstName, lastName, email, password);
        res.status(201).send(`${user.firstName} ${user.lastName} created successfully`);
      } else {
        throw new ValidationError('Email already in use!');
      }
    } catch (err) {
      throw err;
    };
  } else {
    throw new ValidationError('Please ensure all fields are filled out!');
  }
};

module.exports = {
  register
};
