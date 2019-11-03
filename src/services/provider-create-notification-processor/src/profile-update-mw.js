'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to trigger the update of the
 * profile. It assumes the data is pre-validated
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    const profile = {
      uid: req.body.ownerUid,
      isProvider: true
    };

    await repository.update(profile);

    next();
  } catch (err) {
    if (err.code === 'PROFILE_NOT_EXISTING') {
      // Nothing to process so just allow the chain to complete
      next();
      return;
    }

    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
