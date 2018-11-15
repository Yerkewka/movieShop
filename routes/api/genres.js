const express = require('express');
const router = express.Router();

// MongoDB model
const { Genre } = require('../../models/Genres');

// Validators
const { isEmpty, isObjectId } = require('../../validation/helpers');
const validateGenreInput = require('../../validation/genres');

// @url    GET /api/genres
// @desc   Get all genres
// @type   Public
router.get('/', (req, res) => {
  Genre
    .find()
    .then(genres => {
      if (!genres || isEmpty(genres)) {
        return res.status(404).json({ message: "Жанров не найдено" });
      }
      res.json(genres);
    })
    .catch(err => res.status(500).json({ message: "Внутренняя ошибка сервера!" }));
});

// @url    GET /api/genres/:id
// @desc   Get genre by id
// @type   Public
router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: "Неверный id жанра" });
  }

  Genre
    .findById(id)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: "Жанр не найден" });
      }
      res.json(genre);
    })
    .catch(err => res.status(500).json({ message: "Внутренняя ошибка сервера!" }));
});

// @url    GET /api/genres/:id
// @desc   Get genre by id
// @type   Private
router.post('/', (req, res) => {

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
    .catch(err => {
      console.error("Error while saving: ", err);
      res.status(500).json({ message: "Внутренняя ошибка сервера. Ошибка при сохранении." })
    })
});

// @url    PUT /api/genres/:id
// @desc   Update genre
// @type   Private
router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return res.status(400).json({ message: "Неверный id жанра" });
  }

  const { errors, isValid } = validateGenreInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Genre
    .findById(id)
    .then(genre => {
      if (!genre) {
        return res.status(404).json({ message: "Жанр не найден" });
      }
      
      genre.name = req.body.name;
      genre
        .save()
        .then(genre => res.json(genre))
        .catch(err => {
          console.error("Error while saving: ", err);
          res.status(500).json({ message: "Внутренняя ошибка сервера. Не удалось сохранить изменения" });
        });
    })  
})

// @url    DELETE /api/genres/:id
// @desc   Delete genre
// @type   Private
router.delete('/:id', (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Неверный id жанра' });
  }

  Genre.findByIdAndRemove({ _id: req.params.id })
    .then(genre => res.json(genre))
    .catch(err => {
      console.error("Error while deleting: ", err);
      res.status(500).json({ message: 'Не удалось удалить жанр' })
    });
});

module.exports = router;