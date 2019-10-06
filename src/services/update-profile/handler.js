'use strict';

const { BAD_REQUEST, OK } = require('../../lib/constants').statusCodes;
const { clone } = require('lodash');
const {
  duplicateProfile,
  failedSchemaValidation
} = require('../../lib/constants/error-responses');
const definitions = require('../../schema/definitions.json');
const { isEmpty } = require('../../../node_modules/lodash'); // Using the root dependency
const schema = require('../../schema/patch-request-schema.json');
const validator = require('../../lib/util/validator').getValidator({
  schemas: [schema, definitions]
});

module.exports = profileRepository => {
  return {
    patchProfile: async (req, res) => {
      const patchedProfile = req.body;

      // TODO: Verify that the authenticated user is the user for the profiled profile.uid

      if (
        !isEmpty(patchedProfile) &&
        validator.validate(schema, patchedProfile)
      ) {
        await processRequest(res, profileRepository, patchedProfile);
        return;
      }

      rejectRequest(res, validator.errors);
    }
  };
};

async function processRequest(res, profileRepository, patchedProfile) {
  try {
    await profileRepository.update(patchedProfile);
    res.sendStatus(OK);
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
