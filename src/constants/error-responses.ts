'use strict';

const duplicateProfile = {
  code: 'PROFILE_ALREADY_EXISTS',
  message: 'A profile for the provided ID already exists.',
  technicalError: '' as any
};

const profiledIdMissing = {
  code: 'REQUEST_MALFORMED',
  message: 'profileId is a required query parameter',
  technicalError: '' as any
};

const failedSchemaValidation = {
  code: 'REQUEST_MALFORMED',
  message: 'Payload does not pass schema validation',
  technicalError: '' as any
};

const systemError = {
  code: 'SYSTEM_ERROR',
  message: 'Oops something went wrong on our end.',
  technicalError: '' as any
};

export {
  duplicateProfile,
  profiledIdMissing,
  failedSchemaValidation,
  systemError
};
