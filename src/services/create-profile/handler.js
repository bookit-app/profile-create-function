'use strict';

const { BAD_REQUEST, CREATED } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  duplicateProfile,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const { isEmpty } = require('../../../node_modules/lodash'); // Using the root dependency
const { schema } = require('./validator');

module.exports = profileRepository => {
  return {
    createProfile: async (req, res) => {
      const profile = req.body;

      // TODO: Verify that the authenticated use is the user for the profiled profile.uid

      const { error } = await schema.validate(profile);

      if (isEmpty(error)) {
        await processRequest(res, profileRepository, profile);
        return;
      }

      rejectRequest(res, error);
    }
  };
};

async function processRequest(res, profileRepository, profile) {
  try {
    await profileRepository.create(profile);
    res.sendStatus(CREATED);
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.error(err.message);
    res.status(BAD_REQUEST);
    res.send(duplicateProfile);
  }
}

function rejectRequest(res, errors) {
  res.status(BAD_REQUEST);

  const response = clone(failedSchemaValidation);
  response.technicalError = errors;
  res.send(response);
}
