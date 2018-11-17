const express = require('express');
const config = require('config');
const { infoLogger } = require('./config/winston');

// Initializing application
const app = express();

require('./startup/logging')();
require('./startup/middleware')(app);
require('./startup/view')(app);
require('./startup/routes')(app);
require('./startup/db')(config);
require('./startup/config')(config);

// Initialize listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  infoLogger.info(`Server running on port ${port}`);
});
