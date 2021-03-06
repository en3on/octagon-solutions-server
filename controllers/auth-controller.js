const User = require('../models/User.js');
const ResetPassLink = require('../models/ResetPassLink.js');

const {
  generateUser,
  generateToken,
  generateHash,
  comparePassword,
  validatePassword,
  validateAuthString,
  generateResetPassLink,
} = require('../utils/auth-utils.js');

const {ValidationError,
  AuthenticationError} = require('../utils/error-utils.js');

const Mailer = require('../utils/mailer.js');

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
            user: {firstName, lastName, email},
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

    if (foundUser === null) {
      const error = new Error('User Not Found!');
      error.status = 404;

      throw error;
    }

    await comparePassword(plainPassword, foundUser.password);

    const token = await generateToken(foundUser);

    return res.status(200).json({
      message: 'Successfully logged in!',
      token: token,
      user: foundUser,
    });
  } catch (err) {
    next(err);
  };
};

/**
 * Assigns a resetPassLink object to
 * User model and sends out mail with reset link
 * @param {Object} req Post request
 * @param {Object} res Server response
 * @param {Function} next Error handler
 * @return {Object} Response object
 */
async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({email: req.body.email});

    if (user === null) {
      throw new AuthenticationError(404, 'User Not Found!');
    };

    const resetPassLink = generateResetPassLink(user);

    await resetPassLink.save();

    await new Mailer(user, resetPassLink).forgotPassword();
  } catch (err) {
    next(err);
  };

  return res.status(200)
      .send('Email sent successfully, please check your inbox');
};

async function resetPassword(req, res, next) {
  const {authString, newPassword} = req.body;

  try {
    const foundUser = await validateAuthString(authString);

    validatePassword(newPassword);

    const password = await generateHash(newPassword);

    await User.findOneAndUpdate({email: foundUser.email}, {password});

    await ResetPassLink.deleteOne({value: authString});

    res.status(200).send('Successfully updated password');
  } catch (err) {
    next(err);
  };
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
