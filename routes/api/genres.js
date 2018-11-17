const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

// MongoDB model
const { Genre } = require('../../models/Genres');

// Validators
const { isEmpty, isObjectId } = require('../../validation/helpers');
const validateGenreInput = require('../../validation/genres');

// @url    GET /api/genres
// @desc   Get all genres
// @type   Public
router.get('/', (req, res, next) => {
  Genre.find()
    .then(genres => {
      if (!genres || isEmpty(genres)) {
        return res.status(404).json({ message: 'Жанров не найдено' });
      }
      res.json(genres);
    })
    .catch(err => next(err));
});

// @url    GET /api/genres/:id
// @desc   Get genre by id
// @type   Public
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id жанра' });
  }

  Genre.findById(id)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: 'Жанр не найден' });
      }
      res.json(genre);
    })
    .catch(err => next(err));
});

// @url    GET /api/genres/:id
// @desc   Get genre by id
// @type   Private
router.post('/', auth, (req, res, next) => {
  const { errors, isValid } = validateGenreInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newGenre = new Genre({
    name: req.body.name
  });

  newGenre
    .save()
    .then(genre => res.json(genre))
    .catch(err => next(err));
});

// @url    PUT /api/genres/:id
// @desc   Update genre
// @type   Private
router.put('/:id', auth, (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id жанра' });
  }

  const { errors, isValid } = validateGenreInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Genre.findById(id)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: 'Жанр не найден' });
      }

      genre.name = req.body.name;
      genre
        .save()
        .then(genre => res.json(genre))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// @url    DELETE /api/genres/:id
// @desc   Delete genre
// @type   Private
router.delete('/:id', [auth, admin], (req, res, next) => {
  if (!isObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Неверный id жанра' });
  }

  Genre.findByIdAndRemove({ _id: req.params.id })
    .then(genre => res.json(genre))
    .catch(err => next(err));
});

module.exports = router;
