function handleError(err) {
  return {
    name: err.name,
    message: err.message,
  };
}

module.exports = {
  handleError,
}
