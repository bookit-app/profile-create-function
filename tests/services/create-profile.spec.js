'use strict';

const { expect } = require('chai');
const { BAD_REQUEST, CREATED } = require('http-status-codes');
const { stub } = require('sinon');
const { duplicateProfile } = require('../../src/lib/constants').errors;
const createProfileService = require('../../src/services/create-profile/handler');

const req = {
  body: {
    address: {
      city: 'city',
      state: 'NY',
      streetAddress: 'a street somewhere',
      zip: '12345'
    },
    birthday: '2018-11-13',
    email: 'test@test.com',
    firstName: 'test-first-name',
    gender: 'M',
    isProvider: false,
    isSocial: true,
    lastName: 'test-last-name',
    phoneNumber: '123-123-1234',
    uid: 'TEST-UID'
  }
};

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const profileRepositoryMock = {
  create: stub()
};

const handler = createProfileService(profileRepositoryMock);

describe('create-profile: unit tests', () => {
  it('should respond with a 201 when profile is created', () => {
    profileRepositoryMock.create.resolves();
    expect(handler.createProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.sendStatus.called).to.be.true;
      expect(res.sendStatus.calledWithExactly(CREATED)).to.be.true;
    });
  });

  it('should respond with a 400 when the schema validation fails', () => {
    profileRepositoryMock.create.resolves();
    const badReq = {
      body: {}
    };
    expect(handler.createProfile(badReq, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
    });
  });

  it('should respond with a 400 when the profile creation fails', () => {
    profileRepositoryMock.create.rejects(new Error('FORCED ERROR'));
    expect(handler.createProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
      expect(res.send.called).to.be.true;
      expect(res.send.calledWith(duplicateProfile)).to.be.true;
    });
  });
});
