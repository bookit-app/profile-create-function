'use strict';

const { BAD_REQUEST, CREATED } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  duplicateProfile,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const definitions = require('../../schema/definitions.json');
const schema = require('../../schema/post-request-schema.json');
const validator = require('../../lib/util/validator').getValidator({
  schemas: [schema, definitions]
});

module.exports = profileRepository => {
  return {
    createProfile: async (req, res) => {
      const profile = req.body;

      // TODO: Verify that the authenticated use is the user for the profiled profile.uid

      if (validator.validate(schema, profile)) {
        await processRequest(res, profileRepository, profile);
        return;
      }

      rejectRequest(res, validator.errors);
    }
  };
};

async function processRequest(res, profileRepository, profile) {
  try {
    await profileRepository.create(profile);
    res.sendStatus(CREATED);
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.error(err.message);
    res.status(BAD_REQUEST);
    res.send(duplicateProfile);
  }
}

function rejectRequest(res, errors) {
  res.status(BAD_REQUEST);

  const response = clone(failedSchemaValidation);
  response.technicalError = errors;
  res.send(response);
}
