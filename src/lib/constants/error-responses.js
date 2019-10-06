'use strict';

exports.duplicateProfile = {
  code: 'PROFILE_ALREADY_EXISTS',
  message: 'A profile for the provided ID already exists.',
  technicalError: ''
};

exports.profiledIdMissing = {
  code: 'REQUEST_MALFORMED',
  message: 'profileId is a required query parameter',
  technicalError: ''
};

exports.failedSchemaValidation = {
  code: 'REQUEST_MALFORMED',
  message: 'Payload does not pass schema validation',
  technicalError: ''
};

exports.systemError = {
  code: 'SYSTEM_ERROR',
  message: 'Oops something went wrong on our end.',
  technicalError: ''
};
