const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  customer: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
      },
      phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15
      },
      isGold: {
        type: Boolean,
        default: false
      }
    }),
    required: true
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }      
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturn: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

module.exports = {
  Rental: mongoose.model('Rental', rentalSchema),
  rentalSchema
}