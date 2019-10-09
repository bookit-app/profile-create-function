'use strict';

const firestore = require('../../lib/repository/firestore');
const { METHOD_NOT_ALLOWED } = require('../../lib/constants').statusCodes;
const ProfileRepository = require('../../lib/repository/profile-repository');
const handler = require('./handler')(new ProfileRepository(firestore));

/**
 * Entry point for the deleteProfile service.
 * This service will ONLY handle POST requests otherwise
 * it will response with METHOD_NOT_ALLOWED response code
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {*} void
 */
module.exports.deleteProfile = (req, res) => {
  if (req.method === 'POST') {
    handler.deleteProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
};
