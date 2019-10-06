'use strict';

const firestore = require('../../lib/repository/firestore');
const { METHOD_NOT_ALLOWED } = require('../../lib/constants').statusCodes;
const ProfileRepository = require('../../lib/repository/profile-repository');
const handler = require('./handler')(new ProfileRepository(firestore));

module.exports.queryProfile = (req, res) => {
  if (req.method === 'GET') {
    handler.queryProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
};
