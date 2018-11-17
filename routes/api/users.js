const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../../middlewares/auth');

// MongoDB model
const { User } = require('../../models/Users');

// Validators
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   POST /api/users/me
// @desc    Get info about user
// @access  Private
router.get('/me', auth, (req, res, next) => {
  User.findById(req.user._id)
    .select('-password')
    .then(user => res.json(user))
    .catch(err => next(err));
});

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res
          .status(400)
          .json({ message: 'Пользователь с такой почтой уже зарегистрирован' });
      } else {
        let newUser = new User(_.pick(req.body, ['name', 'email', 'password']));

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const token = user.generateAuthToken();

                res
                  .header('x-auth-token', token)
                  .json(_.pick(user, ['_id', 'name', 'email']));
              })
              .catch(err => next(err));
          });
        });
      }
    })
    .catch(err => next(err));
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return res.status(400).json({ message: 'Неверный логин или пароль' });

      bcrypt.compare(req.body.password, user.password).then(isValidPassword => {
        if (isValidPassword) {
          const token = user.generateAuthToken();

          res.json(token);
        } else {
          res.status(400).json({ message: 'Неверный логин или пароль' });
        }
      });
    })
    .catch(err => next(err));
});

module.exports = router;
