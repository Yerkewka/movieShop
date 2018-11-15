const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
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
});

module.exports = {
  Customer: mongoose.model('Customer', customerSchema),
  customerSchema
};
