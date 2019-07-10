const User = require('../models/User.js');
const {generateUser} = require('../utils/auth-utils.js');
const {handleError} = require('../utils/errorHandler.js');

async function register(req, res) {
  const {firstName, lastName, email, password} = req.body;
  if (firstName && lastName && email && password) {
    try {
      const query = await User.findOne({email});

      if (query === null) {
        const user = await generateUser(firstName, lastName, email, password);
        res.status(201).send(`${user.firstName} ${user.lastName} created successfully`);
      } else {
        throw {
          name: 'Email Taken',
          message: `${email} is already in use! Please sign into your account, or use a different email.`,
        };
      }
    } catch (err) {
      const error = handleError(err);
      return res.status(400).json(error);
    };
  } else {
    const error = {
      name: "Invalid Parameters",
      message: "Please make sure all fields are filled in",
    };

    return res.status(400).json(error);
  }
};

module.exports = {
  register
};
