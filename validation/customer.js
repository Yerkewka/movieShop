const Validator = require('validator');
const { isEmpty, isObjectId } = require('./helpers');

module.exports = function validateCustomerInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Поле имя обязательна для заполнения';
  } else if (!Validator.isLength(data.name, { min: 1, max: 100 })) {
    errors.name = 'Поле имя может содержать от 1 до 100 символов';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Поле телефон обязательна для заполнения';
  } else if (!Validator.isLength(data.phone, { min: 10, max: 15 })) {
    errors.phone = 'Поле телефон может содержать от 10 до 15 символов';
  } else if (!Validator.isMobilePhone(data.phone)) {
    errors.phone = 'Введите правильный номер телефона';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
