'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  profileRepositoryInstance
} = require('../../../lib/repository/profile-repository');
// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.get(
  '/profile/:profileId',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('./query-options-mw'),
  require('./query-profile-mw')(profileRepositoryInstance)
);

app.use(require('../../../lib/mw/error-handling-mw'));

// Start up the server and listen on the provided port
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(`Server failed to start due to ${err.message}`);
    return;
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
