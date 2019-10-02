'use strict';

import { BAD_REQUEST, CREATED, METHOD_NOT_ALLOWED } from 'http-status-codes';
import { IProfile, IProfileRepository } from '../repository/profile-repository';
import { duplicateProfile } from './error-responses';

function createProfileHandlerFactory(profileRepository: IProfileRepository) {
  const createProfile = async (req: any, res: any) => {
    const profile: IProfile = req.body;

    // TODO: Verify that the authenticated use is the user for the profiled profile.uid
    // TODO: Build in data validations probably based on a JSON Schema or the OpenAPI specification
    try {
      await profileRepository.create(profile);
      res.sendStatus(CREATED);
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err.message);
      res.status(BAD_REQUEST);
      res.send(duplicateProfile);
    }
  };

  const handler: ICreateProfileHandler = {
    createProfile
  };

  return handler;
}

export interface ICreateProfileHandler {
  createProfile: (req: any, res: any) => Promise<void>;
}
export { createProfileHandlerFactory };
