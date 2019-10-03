'use strict';

import { expect } from 'chai';
import { BAD_REQUEST, CREATED } from 'http-status-codes';
import { stub } from 'sinon';
import { duplicateProfile } from '../../src/constants/error-responses';
import { createProfileHandlerFactory } from '../../src/handlers';
import { IProfileRepository } from '../../src/repository/profile-repository';

const req = {
  body: {
    birthday: new Date(),
    firstName: 'test-first-name',
    gender: 1,
    isProvider: false,
    isSocial: true,
    lastName: 'test-last-name',
    phoneNumber: '123-123-1234'
  }
};

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const createStub = stub();
const findProfileByIdStub = stub();
const profileRepositoryMock: IProfileRepository = {
  create: createStub,
  findByProfileId: findProfileByIdStub
};

const createProfileHandler = createProfileHandlerFactory(
  profileRepositoryMock as IProfileRepository
);

describe('create-profile: unit tests', () => {
  it('should respond with a 201 when profile is created', () => {
    createStub.resolves();
    expect(createProfileHandler.createProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.calledWithExactly(CREATED)).to.be.true;
      }
    );
  });

  it('should respond with a 400 when the profile creation fails', () => {
    createStub.rejects(new Error('FORCED ERROR'));
    expect(createProfileHandler.createProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.send.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.send.calledWith(duplicateProfile)).to.be.true;
      }
    );
  });
});
