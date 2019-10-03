'use strict';

import { Firestore } from '@google-cloud/firestore';
import { METHOD_NOT_ALLOWED } from 'http-status-codes';
import {
  createProfileHandlerFactory,
  queryProfileHandlerFactory
} from './handlers';
import { profileRepositoryFactory } from './repository/profile-repository';

const firestore = new Firestore();
const profileRepository = profileRepositoryFactory(firestore);
const handlers = {
  createProfileHandler: createProfileHandlerFactory(profileRepository),
  queryProfileHandler: queryProfileHandlerFactory(profileRepository)
};

function createProfileFunction(req: any, res: any) {
  if (req.method === 'POST') {
    handlers.createProfileHandler.createProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
}

function queryProfileFunction(req: any, res: any) {
  if (req.method === 'GET') {
    handlers.queryProfileHandler.queryProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
}

function updateProfileFunction(req: any, res: any) {
  if (req.method === 'PUT') {
    handlers.queryProfileHandler.queryProfile(req, res);
  } else {
    res.sendStatus(METHOD_NOT_ALLOWED);
  }
}

export { createProfileFunction, queryProfileFunction, updateProfileFunction };
