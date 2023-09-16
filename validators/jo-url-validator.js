const { isURL } = require('validator');

module.exports = (value, helpers) => {
  if (!isURL(value)) {
    return helpers.message(`\"${helpers.state.path}\" must be a valid url`);
  }
  return value;
};
