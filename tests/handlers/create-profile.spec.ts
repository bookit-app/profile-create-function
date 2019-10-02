'use strict';

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { stub } from 'sinon';
import { createProfileHandlerFactory } from '../../src/handlers/create-profile';
import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { duplicateProfile } from '../../src/handlers/error-responses';
import {
  IProfileRepository,
  IProfile
} from '../../src/repository/profile-repository';

const req = {
  body: {
    firstName: 'test-first-name',
    lastName: 'test-last-name',
    birthday: new Date(),
    phoneNumber: '123-123-1234',
    gender: 1,
    isSocial: true,
    isProvider: false
  }
};

const res = {
  status: stub(),
  send: stub(),
  sendStatus: stub()
};

const createStub = stub();
const profileRepositoryMock: IProfileRepository = {
  create: createStub
};

const createProfileHandler = createProfileHandlerFactory(<IProfileRepository>(
  profileRepositoryMock
));

describe('create-profile: unit tests', () => {
  it('should respond with a 201 when profile is created', () => {
    createStub.resolves();
    expect(createProfileHandler.createProfile(req, res)).to.be.fulfilled.then(
      () => {
        expect(res.sendStatus.called).to.be.true;
        expect(res.sendStatus.calledWithExactly(CREATED)).to.be.true;
      }
    );
  });

  it('should respond with a 400 when the profile creation fails', () => {
    createStub.rejects(new Error('FORCED ERROR'));
    expect(createProfileHandler.createProfile(req, res)).to.be.fulfilled.then(
      () => {
        expect(res.status.called).to.be.true;
        expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
        expect(res.send.called).to.be.true;
        expect(res.send.calledWith(duplicateProfile)).to.be.true;
      }
    );
  });
});
