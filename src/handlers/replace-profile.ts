'use strict';

import Ajv from 'ajv';
import { BAD_REQUEST, CREATED } from 'http-status-codes';
import { clone } from 'lodash';
import {
  duplicateProfile,
  failedSchemaValidation
} from '../constants/error-responses';
import { IProfile, IProfileRepository } from '../repository/profile-repository';
import definitions from '../schema/definitions.json';
import schema from '../schema/put-request-schema.json';

function replaceProfileHandlerFactory(profileRepository: IProfileRepository) {
  const replaceProfile = async (req: any, res: any) => {
    const profile: IProfile = req.body;

    const validator = new Ajv({ schemas: [schema, definitions] });

    if (!validator.validate(schema, profile)) {
      res.status(BAD_REQUEST);

      const response = clone(failedSchemaValidation);
      response.technicalError = validator.errors;
      res.send(response);
      return;
    }

    // TODO: Verify that the authenticated use is the user for the profiled profile.uid
    try {
      await profileRepository.replace(profile);
      res.sendStatus(CREATED);
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err.message);
      res.status(BAD_REQUEST);
      res.send(duplicateProfile);
    }
  };

  return {
    replaceProfile
  } as IReplaceProfileHandler;
}

export interface IReplaceProfileHandler {
  replaceProfile: (req: any, res: any) => Promise<void>;
}
export { replaceProfileHandlerFactory };
