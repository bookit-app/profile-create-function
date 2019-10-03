'use strict';

const duplicateProfile = {
  code: 'PROFILE_ALREADY_EXISTS',
  message: 'A profile for the provided ID already exists.',
  technicalError: ''
};

const profiledIdMissing = {
  code: 'REQUEST_MALFORMED',
  message: 'profileId is a required query parameter',
  technicalError: ''
};

const systemError = {
  code: 'SYSTEM_ERROR',
  message: 'Oops something went wrong on our end.',
  technicalError: ''
};

export { duplicateProfile, profiledIdMissing, systemError };
