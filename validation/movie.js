const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateMovieInput(data) {
  let errors = {};

  let { title, genreId, numberInStock, dailyRentalRate } = data;

  title = !isEmpty(title) ? title : '';
  genreId = !isEmpty(genreId) ? genreId : '';
  numberInStock = !isEmpty(numberInStock) ? `${numberInStock}` : '';
  dailyRentalRate = !isEmpty(dailyRentalRate) ? `${dailyRentalRate}` : '';

  if (Validator.isEmpty(title)) {
    errors.title = 'Поле название обязательна для заполнения';
  } else if (!Validator.isLength(title, { min: 2, max: 255 })) {
    errors.title = 'Название может содержать от 2 до 255 символов';
  }

  if (Validator.isEmpty(genreId)) {
    errors.genreId = 'Поле жанр обязательна для заполнения';
  } else if (!isObjectId(genreId)) {
    errors.genreId = 'Неверный id жанра';
  }

  if (Validator.isEmpty(numberInStock)) {
    errors.numberInStock =
      'Поле количесто в наличии обязательна для заполнения';
  } else if (!Validator.isNumeric(numberInStock)) {
    errors.numberInStock =
      'Поле принимает только числовое значение от 0 до 255';
  }

  if (Validator.isEmpty(dailyRentalRate)) {
    errors.dailyRentalRate = 'Поле арендная ставка обязательна для заполнения';
  } else if (!Validator.isNumeric(dailyRentalRate)) {
    errors.dailyRentalRate =
      'Поле принимает только числовое значение от 0 до 255';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
