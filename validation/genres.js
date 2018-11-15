const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateGenreInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Поле название обязательна для заполнения";
  } else if (!Validator.isLength(data.name, { min: 3, max: 255 })) {
    errors.name = "Название жанра может содержать от 3 до 255 символов";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}