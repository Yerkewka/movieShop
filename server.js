const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');

// Initializing application
const app = express();

// Colors for debuging
const supportsColor = require('supports-color');

// Initializing debugger in dev
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

// Inizializing view engine 'pug'
app.set('view engine', 'pug');
app.set('views', './view');

// Routers
const rootRouter = require('./routes/root');
const customersRouter = require('./routes/api/customers');
const genresRouter = require('./routes/api/genres');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// Initializing Morgan to log request
if (process.env.NODE_ENV === undefined || app.get('env') === 'development') {
  app.use(morgan('short'));
  startupDebugger('Morgan enabled...');
}

// MongoDB Url and Connecting to DB
const mongoURL = config.get('mongoURL');
mongoose
  .connect(
    mongoURL,
    { useNewUrlParser: true }
  )
  .then(() => dbDebugger('Connected to MongoDB...'))
  .catch(err => dbDebugger("Error: Couldn't connect to MongoDB" + err));

// App routes middlewares
app.use('/', rootRouter);
app.use('/api/customers', customersRouter);
app.use('/api/genres', genresRouter);

// Initialize listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  startupDebugger(`Server running on port ${port}`);
});
