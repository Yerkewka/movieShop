const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateLoginInput(data) {
  let errors = {};

  let { email, password } = data;

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(email)) {
    errors.email = 'Поле почта обязательна для заполнения';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Введите валидный почтовый адрес';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Поле пароль обязательна для заполнения';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
