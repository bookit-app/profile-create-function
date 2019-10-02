'use strict';

import { Firestore } from '@google-cloud/firestore';
import { METHOD_NOT_ALLOWED } from 'http-status-codes';
import { createProfileHandlerFactory } from './handlers/create-profile';
import { profileRepositoryFactory } from './repository/profile-repository';

const firestore = new Firestore();
const profileRepository = profileRepositoryFactory(firestore);
const handlers = {
  createProfileHandler: createProfileHandlerFactory(profileRepository)
};

function createProfileFunction(req: any, res: any) {
  switch (req.method) {
    case 'POST':
      return handlers.createProfileHandler.createProfile(req, res);
    default:
      res.sendStatus(METHOD_NOT_ALLOWED);
      return;
  }
}

export { createProfileFunction };
