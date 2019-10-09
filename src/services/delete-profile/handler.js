'use strict';

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND
} = require('../../lib/constants').statusCodes;
const {
  systemError,
  profiledIdMissing
} = require('../../lib/constants/error-responses');
const { extractTraceIdFromHeader } = require('../../lib/util');
const { clone, isEmpty } = require('lodash');
const { schema } = require('./validator');
const logger = require('../../lib/util/logger');

/**
 * Factory function for the deleteProfile handler
 *
 * @param {ProfileRepository} profileRepository
 * @returns {*} void
 */
module.exports = profileRepository => {
  if (isEmpty(profileRepository)) {
    throw new Error('Dependencies not provided.');
  }

  return {
    deleteProfile: async (req, res) => {
      const data = {
        uid: req.params.profileId
      };
      const trace = extractTraceIdFromHeader(req);

      // TODO: Verify that the authenticated use is the user for the profiled profile.uid

      console.log(JSON.stringify(data));
      const { error } = await schema.validate(data);

      if (isEmpty(error)) {
        await processRequest(res, profileRepository, data.uid, trace);
        return;
      }

      await rejectRequest(res, error);
    }
  };
};

/**
 * Handles the processing for deleting a profile
 *
 * @param {Express.Request} res
 * @param {ProfileRepository} profileRepository
 * @param {String} profileId
 * @param {String} trace
 */
async function processRequest(res, profileRepository, profileId, trace) {
  try {
    const profile = await profileRepository.findByProfileId(profileId);

    if (!isEmpty(profile)) {
      await profileRepository.delete(profileId);

      logger.info({
        code: 'PROFILE_DELETED',
        message: `Profile for UID ${profile.uid} successfully deleted`
      });

      res.sendStatus(NO_CONTENT);
    } else {
      res.sendStatus(NOT_FOUND);
    }
  } catch (err) {
    const response = clone(systemError);
    response.traceId == trace;
    response.technicalError = err.message;
    res.status(INTERNAL_SERVER_ERROR);
    res.send(response);
  }
}

/**
 * If a request is rejected this function is called to prepare the
 * response to the request
 *
 * @param {Express.Response} res
 * @param {Array<*>} errors
 * @param {String} trace
 */
async function rejectRequest(res, errors, trace) {
  res.status(BAD_REQUEST);

  const response = clone(profiledIdMissing);
  response.technicalError = errors.details;
  logger.error(response);

  response.traceId = trace;
  res.send(response);
}
