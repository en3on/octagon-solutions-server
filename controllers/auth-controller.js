const User = require('../models/User.js');
const {
  generateUser,
  generateToken,
  comparePassword,
  generateRandomString,
} = require('../utils/auth-utils.js');

const {ValidationError} = require('../utils/error-utils.js');

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
    });
  } catch (err) {
    next(err);
  };
};

async function forgotPassword(req, res, next) {
  try {
    const user = req.body.user;

    console.log({user});

    const resetPassLink = {
      value: generateRandomString(),
      expiry: new Date(Date.now() + 1800000),
    };

    console.log({resetPassLink});

    await User.findOneAndUpdate({email: user.email}, {resetPassLink: resetPassLink}, function(err, doc) {
      if (err) console.log({err});
    });

    const updatedUser = await User.findOne({email: user.email});

    console.log({updatedUser});

    await new Mailer(user).forgotPassword();
  } catch (err) {
    console.log(err);
    next(err);
  };

  res.status(200).send('Email sent successfully, please check your inbox');
};

module.exports = {
  register,
  login,
  forgotPassword,
};
