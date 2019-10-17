'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/profile-update-schema.json',
  type: 'object',
  required: ['email', 'firstName', 'lastName', 'isProvider'],
  properties: {
    birthday: {
      type: 'string',
      format: 'date'
    },
    firstName: {
      type: 'string',
      minLength: 1
    },
    gender: {
      type: 'string',
      enum: ['M', 'F', 'O']
    },
    lastName: {
      type: 'string',
      minLength: 1
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'
    },
    isProvider: {
      type: 'boolean'
    },
    address: {
      type: 'object',
      properties: {
        streetAddress: {
          type: 'string',
          minLength: 1
        },
        city: {
          type: 'string',
          minLength: 1
        },
        state: {
          type: 'string',
          minLength: 2,
          maxLength: 2
        },
        zip: {
          type: 'string',
          minLength: 5,
          maxLength: 5
        }
      },
      required: ['streetAddress', 'city', 'state', 'zip']
    },
    preferences: {
      type: 'object',
      properties: {
        day: {
          type: 'number'
        },
        time: {
          type: 'string',
          enum: ['MORNING', 'AFTERNOON', 'EVENING']
        },
        providerId: {
          type: 'string'
        },
        staffClassification: {
          type: 'string'
        },
        style: {
          type: 'string'
        }
      }
    }
  }
};
