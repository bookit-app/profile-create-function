'use strict';

const { expect } = require('chai');
const {
  BAD_REQUEST,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('http-status-codes');
const { stub } = require('sinon');
const deleteProfileService = require('../../src/services/delete-profile/handler');

const profile = {
  address: {
    city: 'city',
    state: 'NY',
    streetAddress: 'a street somewhere',
    zip: 12345
  },
  birthday: '11-13-2019',
  email: 'test@test.com',
  firstName: 'test-first-name',
  gender: 'M',
  isProvider: false,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  uid: 'TEST'
};

const req = {
  header: stub().returns('TEST/TRACE'),
  params: {
    profileId: 'TEST'
  }
};

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const profileRepositoryMock = {
  findByProfileId: stub(),
  delete: stub()
};

const handler = deleteProfileService(profileRepositoryMock);

describe('delete-profile: unit tests', () => {
  afterEach(() => {
    profileRepositoryMock.delete.resetHistory();
    profileRepositoryMock.findByProfileId.resetHistory();
  });

  it('should throw error when required dependencies are not provided', () => {
    expect(deleteProfileService).to.throw(Error);
  });

  it('should respond with a 204 when profile is deleted', () => {
    profileRepositoryMock.delete.resolves();
    profileRepositoryMock.findByProfileId.resolves(profile);
    expect(handler.deleteProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.sendStatus.called).to.be.true;
      expect(res.sendStatus.calledWithExactly(NO_CONTENT)).to.be.true;
    });
  });

  it('should respond with a 400 when the schema validation fails', () => {
    profileRepositoryMock.delete.resolves();
    const badReq = {
      header: stub().returns('TEST/TRACE'),
      params: {}
    };

    expect(handler.deleteProfile(badReq, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
    });
  });

  it('should respond with a 404 when the profile does not exist', () => {
    profileRepositoryMock.findByProfileId.resolves(undefined);
    profileRepositoryMock.delete.rejects(new Error('FORCED ERROR'));
    expect(handler.deleteProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.sendStatus.called).to.be.true;
      expect(res.sendStatus.calledWithExactly(NOT_FOUND)).to.be.true;
    });
  });

  it('should respond with a 500 when the profile delete fails', () => {
    profileRepositoryMock.findByProfileId.resolves(profile);
    profileRepositoryMock.delete.rejects(new Error('FORCED ERROR'));
    expect(handler.deleteProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(INTERNAL_SERVER_ERROR)).to.be.true;
      expect(res.send.called).to.be.true;
    });
  });
});
