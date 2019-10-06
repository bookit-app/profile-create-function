'use strict';

const Joi = require('@hapi/joi');

module.exports.schema = Joi.object({
  address: Joi.object({
    city: Joi.string(),
    state: Joi.string(),
    streetAddress: Joi.string(),
    zip: Joi.number()
  }),
  birthday: Joi.date(),
  gender: Joi.string()
    .length(1)
    .pattern(/^\1(M)|(F)|(O)$/),
  isProvider: Joi.boolean(),
  isSocial: Joi.boolean(),
  phoneNumber: Joi.string().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
  uid: Joi.string()
    .alphanum()
    .min(3)
    .required()
});
