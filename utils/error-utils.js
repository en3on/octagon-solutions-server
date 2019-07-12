class ValidationError extends Error {
  constructor(message, requirements = undefined) {
    super(message);
    this.name = 'ValidationError';
    this.requirements = requirements;
  }
}

module.exports = {
  ValidationError,
};
