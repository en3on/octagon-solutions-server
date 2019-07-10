function getFuncName(func) {
  const regexp = /function (.+)\(/
  return regexp.exec(func.toString())[1];
}

function handleError(err) {
  return {
    name: err.name,
    message: err.message,
  };
}

module.exports = {
  handleError,
}
