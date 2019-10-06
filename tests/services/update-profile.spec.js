'use strict';

const { expect } = require('chai');
const { BAD_REQUEST, OK } = require('http-status-codes');
const { stub } = require('sinon');
const updateProfileService = require('../../src/services/update-profile/handler');

const req = {
  header: stub().returns('TEST/TRACE'),
  body: {
    address: {
      city: 'city',
      state: 'NY',
      streetAddress: 'a street somewhere',
      zip: '12345'
    },
    birthday: '2018-11-13',
    gender: 'M',
    isProvider: false,
    isSocial: true,
    phoneNumber: '123-123-1234',
    uid: 'TEST'
  }
};

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const profileRepositoryMock = {
  update: stub()
};

const logMock = {
  info: stub().resolves(),
  error: stub().resolves()
};

const handler = updateProfileService(profileRepositoryMock, logMock);

describe('update-profile: unit tests', () => {
  it('should throw error when required dependencies are not provided', () => {
    expect(updateProfileService).to.throw(Error);
  });

  it('should respond with a 201 when profile is updated', () => {
    profileRepositoryMock.update.resolves();
    expect(handler.patchProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.sendStatus.called).to.be.true;
      expect(res.sendStatus.calledWithExactly(OK)).to.be.true;
    });
  });

  it('should respond with a 400 when no body is provided', () => {
    profileRepositoryMock.update.resolves();
    const badReq = {
      header: stub().returns('TEST/TRACE'),
      body: {}
    };

    expect(handler.patchProfile(badReq, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
    });
  });

  it('should respond with a 400 when the schema validation fails', () => {
    profileRepositoryMock.update.resolves();
    const badReq = {
      header: stub().returns('TEST/TRACE'),
      body: {
        address: {
          city: 'city',
          state: 'NY',
          streetAddress: 'a street somewhere',
          zip: '12345'
        },
        test: 'TEST',
        birthday: '2018-11-13',
        gender: 'M',
        isProvider: false,
        isSocial: true,
        phoneNumber: '123-123-1234',
        uid: 'TEST1234'
      }
    };

    expect(handler.patchProfile(badReq, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
    });
  });

  it('should respond with a 400 when the profile update fails', () => {
    profileRepositoryMock.update.rejects(new Error('FORCED ERROR'));
    expect(handler.patchProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
      expect(res.send.called).to.be.true;
    });
  });
});
