'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  profileRepositoryInstance
} = require('../../../lib/repository/profile-repository');
const { schema } = require('./payload-validations');

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.patch(
  '/profile',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('../../../lib/mw/payload-validation-mw')(schema),
  require('./create-profile-mw')(profileRepositoryInstance),
  require('./success-mw')
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
