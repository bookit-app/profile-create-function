'use strict';

const { BAD_REQUEST, OK } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  systemError,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const { extractTraceIdFromHeader } = require('../../lib/util');
const { isEmpty } = require('../../../node_modules/lodash'); // Using the root dependency
const { schema } = require('./validator');
const logger = require('../../lib/util/logger');

module.exports = profileRepository => {
  if (isEmpty(profileRepository)) {
    throw new Error('Dependencies not provided.');
  }

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
    logger.info({
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
  logger.error(response);

  response.traceId = trace;
  res.send(response);
}
