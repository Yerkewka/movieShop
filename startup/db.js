const mongoose = require('mongoose');
const { infoLogger } = require('../config/winston');

module.exports = function(config) {
  // MongoDB Url and Connecting to DB
  const mongoURL = config.get('mongoURL');
  mongoose
    .connect(
      mongoURL,
      { useNewUrlParser: true }
    )
    .then(() => infoLogger.info('Connected to MongoDB...'));
};
