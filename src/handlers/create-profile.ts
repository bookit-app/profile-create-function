'use strict';

import Ajv from 'ajv';
import { BAD_REQUEST, CREATED } from 'http-status-codes';
import { clone } from 'lodash';
import schema from '../../schema/profile.json';
import {
  duplicateProfile,
  failedSchemaValidation
} from '../constants/error-responses';
import { IProfile, IProfileRepository } from '../repository/profile-repository';

function createProfileHandlerFactory(profileRepository: IProfileRepository) {
  const createProfile = async (req: any, res: any) => {
    const profile: IProfile = req.body;

    const validator = new Ajv();

    if (!validator.validate(schema, profile)) {
      res.status(BAD_REQUEST);

      const response = clone(failedSchemaValidation);
      response.technicalError = validator.errors;
      res.send(response);
    }

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

  return {
    createProfile
  } as ICreateProfileHandler;
}

export interface ICreateProfileHandler {
  createProfile: (req: any, res: any) => Promise<void>;
}
export { createProfileHandlerFactory };
