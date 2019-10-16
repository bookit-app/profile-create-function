'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  profileRepositoryInstance
} = require('../../../lib/repository/profile-repository');
const logger = require('../../../lib/util/logger');

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.delete(
  '/profile/:profileId',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('./query-profile-mw')(profileRepositoryInstance),
  require('./delete-profile-mw')(profileRepositoryInstance),
  require('./success-mw')
);

app.use(require('../../../lib/mw/error-handling-mw'));

// Start up the server and listen on the provided port
app.listen(process.env.PORT, err => {
  if (err) {
    logger.info(`Server failed to start due to ${err.message}`);
    return;
  }
  logger.info(`Server is running on port ${process.env.PORT}`);
});
