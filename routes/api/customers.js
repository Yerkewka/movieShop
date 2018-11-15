const express = require('express');
const router = express.Router();

// MongoDB model
const { Customer } = require('../../models/Customers');

// Validators
const { isEmpty, isObjectId } = require('../../validation/helpers');
const validateCustomerInput = require('../../validation/customer');

// @url    GET /api/customers
// @desc   Get all customers
// @type   Public
router.get('/', (req, res) => {
  Customer.find()
    .then(customers => {
      if (!customers || isEmpty(customers)) {
        return res.status(404).json({ message: 'Заказчиков не найдено' });
      }
      res.json(customers);
    })
    .catch(err => res.status(500).json('Внутренняя ошибка сервера!'));
});

// @url    GET /api/customers/:id
// @desc   Get customer by id
// @type   Public
router.get('/:id', (req, res) => {
  const id = req.params.id;

  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id заказчика' });
  }
  Customer.findById(id).then(customer => {
    if (!customer) {
      return res.status(404).json({ message: 'Заказчик не найден' });
    }
    res.json(customer);
  });
});

// @url    POST /api/customers
// @desc   Create customer
// @type   Private
router.post('/', (req, res) => {
  const { errors, isValid } = validateCustomerInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newCustomer = {
    name: req.body.name,
    phone: req.body.phone
  };
  if (!isEmpty(req.body.isGold)) {
    newCustomer.isGold = req.body.isGold;
  }

  const customer = new Customer(newCustomer);
  customer
    .save()
    .then(customer => res.json(customer))
    .catch(err =>
      res.status(500).json({ message: 'Ошибка при сохранении данных' })
    );
});

// @url    PUT /api/customers/:id
// @desc   Update customer
// @type   Private
router.put('/:id', (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Неверный id заказчика' });
  }

  const { errors, isValid } = validateCustomerInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Customer.findById(req.params.id).then(customer => {
    if (!customer) {
      return res.status(404).json({ message: 'Заказчик не найден' });
    }
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    if (!isEmpty(req.body.isGold)) {
      customer.isGold = req.body.isGold;
    }
    customer
      .save()
      .then(customer => res.json(customer))
      .catch(err =>
        res.status(500).json({ message: 'Ошибка при сохранении данных' })
      );
  });
});

// @url    DELETE /api/customers/:id
// @desc   Delete customer
// @type   Private
router.delete('/:id', (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Неверный id заказчика' });
  }

  Customer.findByIdAndRemove({ _id: req.params.id })
    .then(customer => res.json(customer))
    .catch(err =>
      res.status(500).json({ message: 'Не удалось удалить заказчика' })
    );
});

module.exports = router;
