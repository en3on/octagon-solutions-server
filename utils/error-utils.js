class ValidationError extends Error {
  constructor(status, message, requirements = undefined) {
    super(message);
    this.status = status;
    this.name = 'ValidationError';
    this.message = message;
    this.requirements = requirements;
  }
}

class AuthenticationError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'AuthenticationError';
    this.message = message;
  }
}

function errorHandler(err, req, res, next) {
  // console.error('AN ERROR HAS OCCURRED:', err.name);
  // console.error('Message:', err.message);
  // console.error('Stack Trace:', err.stack);

  res.status(err.status || 500);
  res.json({
    error: {
      name: err.name,
      message: err.message,
      requirements: (err.requirements || undefined),
    },
  });
}

module.exports = {
  ValidationError,
  AuthenticationError,
  errorHandler,
};
