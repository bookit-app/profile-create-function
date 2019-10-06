'use strict';

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} = require('../../lib/constants').statusCodes;
const { clone, isEmpty } = require('lodash');
const {
  profiledIdMissing,
  systemError
} = require('../../lib/constants').errors;

module.exports = profileRepository => {
  const queryProfile = async (req, res) => {
    if (isEmpty(req.query) || isEmpty(req.query.profileId)) {
      return rejectRequest(res);
    }

    await processRequest(res, profileRepository, req.query.profileId);
  };

  return {
    queryProfile
  };
};

async function processRequest(res, profileRepository, profileId) {
  try {
    const profile = await profileRepository.findByProfileId(profileId);

    if (isEmpty(profile)) {
      res.sendStatus(NOT_FOUND);
    } else {
      res.status(OK);
      res.send(profile);
    }
  } catch (err) {
    // tslint:disable-next-line: no-console
    const response = clone(systemError);
    response.technicalError = err.message;
    res.status(INTERNAL_SERVER_ERROR);
    res.send(response);
  }
}

function rejectRequest(res) {
  res.status(BAD_REQUEST);
  res.send(profiledIdMissing);
  return;
}
