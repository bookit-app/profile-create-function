'use strict';

const firestore = require('../../lib/repository/firestore');
const { METHOD_NOT_ALLOWED } = require('../../lib/constants').statusCodes;
const ProfileRepository = require('../../lib/repository/profile-repository');
const logger = require('../../lib/util/logger');
const handler = require('./handler')(new ProfileRepository(firestore), logger);

module.exports.createProfile = (req, res) => {
  if (req.method === 'POST') {
    handler.createProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
};
