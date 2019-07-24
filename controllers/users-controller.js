const User = require('../models/User.js');
const {verifyToken,
  generateHash,
  validatePassword,
  validateEmail,
} = require('../utils/auth-utils.js');

const {ValidationError, AuthenticationError}
    = require('../utils/error-utils.js');

async function changeUserSettingsHandler(req, res, next) {
  const {token} = req.headers;
  const {firstName, lastName, email, password} = req.body;

  try {
    if (firstName && lastName && email) {
      let user = verifyToken(token);
      user = await User.findOne({email: user});

      if (user === null) {
        throw new AuthenticationError(403, 'You are not logged in!');
      };

      validateEmail(email);

      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };

      if (password) {
        validatePassword(password);
        newUser.password = await generateHash(password);
      };

      await User.findOneAndUpdate({email: user.email}, newUser);

      res.status(201).send('User updated successfully!');
    };
  } catch (err) {
    next(err);
  };
};

module.exports = {changeUserSettingsHandler};
