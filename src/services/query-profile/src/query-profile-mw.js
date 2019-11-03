'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { OK, NOT_FOUND } = require('../../../lib/constants').statusCodes;
const { clone, isEmpty } = require('../../../../node_modules/lodash');

module.exports = profileRepository => async (req, res, next) => {
  try {
    const profile = await profileRepository.findByProfileId(req.apiUserInfo.id);

    isEmpty(profile) ? res.sendStatus(NOT_FOUND) : res.status(OK).send(profile);
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
