const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  let { name, email, password } = data;

  name = !isEmpty(name) ? name : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(name)) {
    errors.name = 'Поле имя обязательна для заполнения';
  } else if (!Validator.isLength(name, { min: 2, max: 255 })) {
    errors.name = 'Поле имя должно составлять от 2 до 255 символов';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Поле почта обязательна для заполнения';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Введите валидный почтовый адрес';
  } else if (!Validator.isLength(email, { min: 2, max: 100 })) {
    errors.email = 'Поле почта должно составлять от 2 до 100 символов';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Поле пароль обязательна для заполнения';
  } else if (!Validator.isLength(password, { min: 8 })) {
    errors.password = 'Поле пароль должно составлять не меньше 8 символов';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
