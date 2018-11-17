const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 100
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey'),
    {
      expiresIn: 3600
    }
  );
  return token;
};

module.exports = {
  User: mongoose.model('User', userSchema),
  userSchema
};
