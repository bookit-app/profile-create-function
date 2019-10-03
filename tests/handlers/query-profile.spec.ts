'use strict';

import { expect } from 'chai';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status-codes';
import { stub } from 'sinon';
import { profiledIdMissing } from '../../src/constants/error-responses';
import { queryProfileHandlerFactory } from '../../src/handlers';
import { IProfileRepository } from '../../src/repository/profile-repository';

const req = {
  query: {
    profileId: 'TEST-UID'
  }
};

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const findProfileByIdStub = stub();
const profileRepositoryMock: IProfileRepository = {
  create: stub(),
  findByProfileId: findProfileByIdStub
};

const queryProfileHandler = queryProfileHandlerFactory(
  profileRepositoryMock as IProfileRepository
);

const profile = {
  birthday: new Date(),
  firstName: 'test-first-name',
  gender: 1,
  isProvider: false,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  uid: 'TEST-UID'
};

describe('create-profile: unit tests', () => {
  it('should respond with a 200 and the profile', () => {
    findProfileByIdStub.resolves(profile);
    expect(queryProfileHandler.queryProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.calledWithExactly(OK)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.send.calledWith(profile)).to.be.true;
      }
    );
  });

  it('should respond with a 400 when the no query parameters are provided', () => {
    expect(queryProfileHandler.queryProfile({}, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.send.calledWithExactly(profiledIdMissing)).to.be.true;
      }
    );
  });

  it('should respond with a 400 when the no profileId is provided', () => {
    expect(
      queryProfileHandler.queryProfile({ query: {} }, res)
    ).to.be.fulfilled.then(() => {
      // tslint:disable-next-line: no-unused-expression
      expect(res.status.called).to.be.true;
      // tslint:disable-next-line: no-unused-expression
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
      // tslint:disable-next-line: no-unused-expression
      expect(res.send.calledWithExactly(profiledIdMissing)).to.be.true;
    });
  });

  it('should respond with a 404 when the profile does not exist', () => {
    findProfileByIdStub.resolves(undefined);
    expect(queryProfileHandler.queryProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(findProfileByIdStub.calledWith(profile.uid)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.calledWithExactly(NOT_FOUND)).to.be.true;
      }
    );
  });

  it('should respond with a 500 something fails with the query', () => {
    findProfileByIdStub.rejects(new Error('FORCED_ERROR'));
    expect(queryProfileHandler.queryProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.calledWithExactly(INTERNAL_SERVER_ERROR)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.send.called).to.be.true;
      }
    );
  });
});
