const config = require('config');
const appRoot = require('app-root-path');
const winston = require('winston');
const { format } = winston;
require('winston-mongodb');

let options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    // maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    colors: {
      info: 'blue',
      warn: 'yellow',
      error: 'red'
    },
    format: format.combine(format.splat(), format.simple())
  },
  MongoDB: {
    db: config.get('mongoURL'),
    level: 'warn',
    handleExceptions: true
  }
};

const errorsLogger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.MongoDB(options.MongoDB, { useNewUrlParser: true })
  ],
  exitOnError: false // Do not exit on handled exceptions
});

const infoLogger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false
});

errorsLogger.stream = {
  write: function(message, encoding) {
    errorsLogger.info(message);
  }
};

module.exports = {
  infoLogger,
  errorsLogger
};
