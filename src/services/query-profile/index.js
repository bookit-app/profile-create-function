'use strict';

const firestore = require('../../lib/repository/firestore');
const { METHOD_NOT_ALLOWED } = require('../../lib/constants').statusCodes;
const ProfileRepository = require('../../lib/repository/profile-repository');
const handler = require('./handler')(new ProfileRepository(firestore));
const express = require('express');

/**
 * Entry point for the queryProfile service.
 * This service will ONLY handle GET requests otherwise
 * it will respond with METHOD_NOT_ALLOWED response code
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {*} void
 */

function queryProfile(req, res) {
  if (req.method === 'GET') {
    handler.queryProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
}

// Use express here so that the URL is properly parsed
// This will allow access to path parameters as needed
const app = express();
app.get('/profile/:profileId', (req, res) => {
  queryProfile(req, res);
});

module.exports.app = app;
