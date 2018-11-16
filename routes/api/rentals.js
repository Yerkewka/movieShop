const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

// MongoDB models
const { Rental } = require('../../models/Rentals');
const { Customer } = require('../../models/Customers');
const { Movie } = require('../../models/Movies');

// Validators
const { isEmpty, isObjectId } = require('../../validation/helpers');
const validateRentalInput = require('../../validation/rental');

// @url   GET /api/rentals
// @desc  Getting all rentals
// @type  Private
router.get('/', (req, res)=>{
  Rental
    .find()
    .then(rentals => {
      if (!rentals || isEmpty(rentals)) {
        return res.status(404).json({ message: "Заказов на аренду не найдено" });
      }
      res.json(rentals);
    })
    .catch(err => {
      console.error("Error while searching: ", err);
      res.status(500).json({ message: "Внутренняя ошибка сервера. Ошибка при пойске" });
    })
});

// @url   GET /api/rentals/:id
// @desc  Getting rental by id
// @type  Private
router.get('/:id', (req, res) => {
  const id = req.body.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: "Неверный id заказа на аренду" });
  }

  Rental
    .findById(id)
    .then(rental => {
      if (!rental) {
        return res.status(404).json({ message: "Заказ на аренду не найден" });
      }
      
      res.json(rental);
    })
    .catch(err => {
      console.error("Error while searching: ", err);
      res.status(500).json({ message: "Внутрення ошибка сервера. Ошибка при пойске" });
    })
});

// @url   POST /api/rentals
// @desc  Create rental
// @type  Private
router.post('/', async (req, res) => {
  const { errors, isValid } = validateRentalInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).json({ message: "Заказчик не найден" });

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).json({ message: "Фильм не найден" });

  if (movie.numberInStock === 0) return res.status(404).json({ message: "Фильма нет в наличии" });

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {

    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();

    res.json(rental);
  } catch(ex) {
    console.error("Error while fawn task: ", ex);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }

});

module.exports = router;