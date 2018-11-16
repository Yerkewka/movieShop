const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateRentalInput(data) {
  let errors = {};

  let { customerId, movieId } = data;

  customerId = !isEmpty(customerId) ? customerId : "";
  movieId = !isEmpty(movieId) ? movieId : "";

  if (Validator.isEmpty(customerId)) {
    errors.customerId = "Неуказан заказчик";
  } else if (!isObjectId(customerId)) {
    errors.customerId = "Неверный id заказчика";
  }

  if (Validator.isEmpty(movieId)) {
    errors.movieId = "Неуказан фильм";
  } else if (!isObjectId(movieId)) {
    errors.movieId = "Неверный id фильма";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}