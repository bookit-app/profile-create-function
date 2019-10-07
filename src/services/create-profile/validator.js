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
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string()
    .length(1)
    .pattern(/^\1(M)|(F)|(O)$/),
  isProvider: Joi.boolean().required(),
  isSocial: Joi.boolean().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
  uid: Joi.string()
    .alphanum()
    .min(3)
    .required()
});
