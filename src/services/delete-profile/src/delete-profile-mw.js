'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('lodash');

module.exports = profileRepository => async (req, res, next) => {
  try {
    await profileRepository.delete(req.apiUserInfo.id);
    console.log(`Profile for UID ${req.apiUserInfo.id} successfully deleted`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
