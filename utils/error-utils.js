class ValidationError extends Error {
  constructor(status, message, requirements = undefined) {
    super(message);
    this.status = status;
    this.name = 'ValidationError';
    this.requirements = requirements;
  }
}

module.exports = {
  ValidationError,
};
