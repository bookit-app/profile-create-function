'use strict';

const { BAD_REQUEST, OK } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  duplicateProfile,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const { isEmpty } = require('../../../node_modules/lodash'); // Using the root dependency
const { schema } = require('./validator');

module.exports = profileRepository => {
  return {
    patchProfile: async (req, res) => {
      const patchedProfile = req.body;

      // TODO: Verify that the authenticated user is the user for the profiled profile.uid
      const { error } = await schema.validate(patchedProfile);

      if (!isEmpty(patchedProfile) && isEmpty(error)) {
        await processRequest(res, profileRepository, patchedProfile);
        return;
      }

      rejectRequest(res, error);
    }
  };
};

async function processRequest(res, profileRepository, patchedProfile) {
  try {
    await profileRepository.update(patchedProfile);
    res.sendStatus(OK);
  } catch (err) {
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
