'use strict';

const LOG_NAME = 'create-profile-handler';
const { BAD_REQUEST, CREATED } = require('../../lib/constants').statusCodes;
const {
  systemError,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const { extractTraceIdFromHeader } = require('../../lib/util');
const { clone, isEmpty } = require('lodash');
const { schema } = require('./validator');
let logger;

module.exports = (profileRepository, log) => {
  if (isEmpty(profileRepository) || isEmpty(log)) {
    throw new Error('Dependencies not provided.');
  }

  logger = log;

  return {
    createProfile: async (req, res) => {
      const profile = req.body;
      const trace = extractTraceIdFromHeader(req);

      // TODO: Verify that the authenticated use is the user for the profiled profile.uid

      const { error } = await schema.validate(profile);

      if (isEmpty(error)) {
        await processRequest(res, profileRepository, profile, trace);
        return;
      }

      await rejectRequest(res, error);
    }
  };
};

async function processRequest(res, profileRepository, profile, trace) {
  try {
    await profileRepository.create(profile);

    await logger.info(LOG_NAME, {
      code: 'PROFILE_CREATED',
      message: `Profile for UID ${profile.uid} successfully created`
    });

    res.sendStatus(CREATED);
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
  response.technicalError = errors.details;
  await logger.error(LOG_NAME, response);

  response.traceId = trace;
  res.send(response);
}
