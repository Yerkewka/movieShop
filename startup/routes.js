// Routers
const rootRouter = require('../routes/root');
const customersRouter = require('../routes/api/customers');
const genresRouter = require('../routes/api/genres');
const moviesRouter = require('../routes/api/movies');
const rentalsRouter = require('../routes/api/rentals');
const usersRouter = require('../routes/api/users');
// Error handler middleware
const error = require('../middlewares/error');

module.exports = function(app) {
  // App routes middlewares
  app.use('/', rootRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/genres', genresRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/users', usersRouter);
  // Handeling errors
  app.use(error);
};
