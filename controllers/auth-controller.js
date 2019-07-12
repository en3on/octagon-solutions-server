const User = require('../models/User.js');
const {generateUser, generateToken} = require('../utils/auth-utils.js');
const {ValidationError} = require('../utils/error-utils.js');

async function register(req, res, next) {
  const {firstName, lastName, email, password} = req.body;
  try {
    if (firstName && lastName && email && password) {
      try {
        const query = await User.findOne({email});

        if (query === null) {
          const user = await generateUser(firstName, lastName, email, password);

          const token = await generateToken(user);

          return res.status(201).json({
            message: 'User registration successful!',
            token: token,
          });

        } else {
          next(new ValidationError(400, 'Email already in use!'));
        }
      } catch (err) {
        next(err);
      };
    } else {
      next(new ValidationError(400, 'Please ensure all fields are filled out!'));
    }
  } catch (err) {
    next(err);
  };
};

module.exports = {
  register
};
