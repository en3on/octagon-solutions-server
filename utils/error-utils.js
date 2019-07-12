class ValidationError extends Error {
  constructor(status, message, requirements = undefined) {
    super(message);
    this.status = status;
    this.name = 'ValidationError';
    this.message = message;
    this.requirements = requirements;
  }
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      name: err.name,
      message: err.message,
      requirements: (err.requirements || undefined),
    }
  });
}

module.exports = {
  ValidationError,
  errorHandler,
};
