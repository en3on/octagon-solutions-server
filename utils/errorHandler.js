function handleError(err) {
  return {
    name: err.name,
    message: err.message,
    requirements: err.requirements || null,
  };
}

module.exports = {
  handleError,
}
