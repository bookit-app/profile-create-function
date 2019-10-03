'use strict';

import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status-codes';
import { clone, isEmpty } from 'lodash';
import { profiledIdMissing, systemError } from '../constants/error-responses';
import { IProfileRepository } from '../repository/profile-repository';

function queryProfileHandlerFactory(profileRepository: IProfileRepository) {
  const queryProfile = async (req: any, res: any) => {
    if (isEmpty(req.query) || isEmpty(req.query.profileId)) {
      res.status(BAD_REQUEST);
      res.send(profiledIdMissing);
    }

    const profileId: string = req.query.profileId;

    try {
      const profile = await profileRepository.findByProfileId(profileId);

      if (isEmpty(profile)) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.status(OK);
        res.send(profile);
      }
    } catch (err) {
      // tslint:disable-next-line: no-console
      const response = clone(systemError);
      response.technicalError = err.message;
      res.status(INTERNAL_SERVER_ERROR);
      res.send(response);
    }
  };

  return {
    queryProfile
  } as IQueryProfileHandler;
}

export interface IQueryProfileHandler {
  queryProfile: (req: any, res: any) => Promise<void>;
}
export { queryProfileHandlerFactory };
