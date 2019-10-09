'use strict';

const firestore = require('../../lib/repository/firestore');
const { METHOD_NOT_ALLOWED } = require('../../lib/constants').statusCodes;
const ProfileRepository = require('../../lib/repository/profile-repository');
const handler = require('./handler')(new ProfileRepository(firestore));
const express = require('express');

/**
 * Entry point for the deleteProfile service.
 * This service will ONLY handle POST requests otherwise
 * it will response with METHOD_NOT_ALLOWED response code
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {*} void
 */
function deleteProfile(req, res) {
  if (req.method === 'DELETE') {
    handler.deleteProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
}

// Use express here so that the URL is properly parsed
// This will allow access to path parameters as needed
const app = express();
app.delete('/:profileId', (req, res) => {
  deleteProfile(req, res);
});

module.exports.app = app;
