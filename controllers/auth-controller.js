const User = require('../models/User.js');
const {
  generateUser,
  generateToken,
  comparePassword,
} = require('../utils/auth-utils.js');

const {ValidationError} = require('../utils/error-utils.js');

/**
 * register function for users
 * @param {Object} req request object for express
 * @param {Object} res response object to send back to client
 * @param {function} next passes request to next route
 * @return {Object} 201 response with token
 */
async function register(req, res, next) {
  const {firstName, lastName, email, password} = req.body;
  try {
    if (firstName && lastName && email && password) {
      try {
        const query = await User.findOne({email});

        if (query === null) {
          const user = await generateUser({
            firstName,
            lastName,
            email,
            password,
          });

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
      next(
          new ValidationError(400, 'Please ensure all fields are filled out!')
      );
    }
  } catch (err) {
    next(err);
  };
};

/**
 * login function for users
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {Function} next express next function
 * @return {Object} returns 200 status with token
 */
async function login(req, res, next) {
  try {
    const {email, password: plainPassword} = req.body;
    const foundUser = await User.findOne({email});

    await comparePassword(plainPassword, foundUser.password);

    const token = await generateToken(foundUser);

    return res.status(200).json({
      message: 'Successfully logged in!',
      token: token,
    });
  } catch (err) {
    next(err);
  };
};

module.exports = {
  register,
  login,
};
