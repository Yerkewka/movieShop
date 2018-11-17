const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

// MongoDB model
const { Movie } = require('../../models/Movies');
const { Genre } = require('../../models/Genres');

// Validators
const { isEmpty, isObjectId } = require('../../validation/helpers');
const validateMovieInput = require('../../validation/movie');

// @url   GET /api/movies
// @desc  Get all movies
// @type  Public
router.get('/', (req, res, next) => {
  Movie.find()
    .then(movies => {
      if (!movies || isEmpty(movies)) {
        return res.status(404).json({ message: 'Фильмов не найдено' });
      }
      res.json(movies);
    })
    .catch(err => next(err));
});

// @url   GET /api/movies/:id
// @desc  Get movie by id
// @type  Public
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id фильма' });
  }

  Movie.findById(id)
    .then(movie => {
      if (!movie) {
        return res.status(404).json({ message: 'Фильм не найден' });
      }

      res.json(movie);
    })
    .catch(err => next(err));
});

// @url   POST /api/movies
// @desc  Create movie
// @type  Private
router.post('/', auth, (req, res, next) => {
  const { errors, isValid } = validateMovieInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Genre.findById(req.body.genreId)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: 'Жанр с таким id не найден' });
      }

      const newMovie = new Movie({
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: parseInt(req.body.numberInStock),
        dailyRentalRate: parseInt(req.body.dailyRentalRate)
      });

      newMovie
        .save()
        .then(movie => res.json(movie))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// @url   PUT /api/movies
// @desc  Update movie
// @type  Private
router.put('/:id', auth, (req, res, next) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id фильма' });
  }

  const { errors, isValid } = validateMovieInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Genre.findById(req.body.genreId)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: 'Жанр с таким id не найден' });
      }

      Movie.findById(id)
        .then(movie => {
          if (!movie) {
            return res
              .status(404)
              .json({ message: 'Фильм с таким id не найден' });
          }

          movie.title = req.body.title;
          movie.genre = {
            _id: genre._id,
            name: genre.name
          };
          movie.numberInStock = parseInt(req.body.numberInStock);
          movie.dailyRentalRate = parseInt(req.body.dailyRentalRate);

          movie
            .save()
            .then(movie => res.json(movie))
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// @url   DELETE /api/movies
// @desc  Delete movie
// @type  Private
router.delete('/:id', [auth, admin], (req, res, next) => {
  const id = req.params.id;

  if (!isObjectId(id)) {
    return res.status(400).json({ message: 'Неверный id фильма' });
  }

  Movie.findByIdAndRemove(id)
    .then(movie => res.json(movie))
    .catch(err => next(err));
});

module.exports = router;
