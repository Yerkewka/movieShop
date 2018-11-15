const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }
});

module.exports = {
  Genre: mongoose.model('Genre', genreSchema),
  genreSchema
}