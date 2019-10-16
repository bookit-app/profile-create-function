'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('lodash');

module.exports = profileRepository => async (req, res, next) => {
  try {
    const profile = req.body;
    profile.uid = req.apiUserInfo.id;
    await profileRepository.update(profile);

    console.log(`Profile for UID ${profile.uid} successfully updated`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
