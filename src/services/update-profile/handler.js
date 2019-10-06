'use strict';

const LOG_NAME = 'update-profile-handler';
const { BAD_REQUEST, OK } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  systemError,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const { extractTraceIdFromHeader } = require('../../lib/util');
const { isEmpty } = require('../../../node_modules/lodash'); // Using the root dependency
const { schema } = require('./validator');
let logger;

module.exports = (profileRepository, log) => {
  if (isEmpty(profileRepository) || isEmpty(log)) {
    throw new Error('Dependencies not provided.');
  }

  logger = log;

  return {
    patchProfile: async (req, res) => {
      const patchedProfile = req.body;
      const trace = extractTraceIdFromHeader(req);

      // TODO: Verify that the authenticated user is the user for the profiled profile.uid
      const { error } = await schema.validate(patchedProfile);

      if (!isEmpty(patchedProfile) && isEmpty(error)) {
        await processRequest(res, profileRepository, patchedProfile, trace);
        return;
      }

      rejectRequest(res, error, trace);
    }
  };
};

async function processRequest(res, profileRepository, patchedProfile, trace) {
  try {
    await profileRepository.update(patchedProfile);
    await logger.info(LOG_NAME, {
      code: 'PROFILE_UPDATED',
      message: `Profile for UID ${patchedProfile.uid} successfully updated`
    });

    res.sendStatus(OK);
  } catch (err) {
    const response = clone(systemError);
    response.traceId == trace;
    res.status(BAD_REQUEST);
    res.send(response);
  }
}

async function rejectRequest(res, errors, trace) {
  res.status(BAD_REQUEST);

  const response = clone(failedSchemaValidation);
  response.technicalError = errors;
  await logger.error(LOG_NAME, response);

  response.traceId = trace;
  res.send(response);
}
