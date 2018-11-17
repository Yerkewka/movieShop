const { errorsLogger } = require('../config/winston');

module.exports = function(err, req, res, next) {
  // Logging exceptions
  if (req.method) {
    errorsLogger.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`,
      err
    );
  } else {
    errorsLogger.error(err.message, err);
  }

  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};
