'use strict';

const Joi = require('@hapi/joi');

/**
 * Schema validator reference
 *
 * @returns {Joi.object}
 */
module.exports.schema = Joi.object({
  uid: Joi.string()
    .alphanum()
    .min(3)
    .required()
});
