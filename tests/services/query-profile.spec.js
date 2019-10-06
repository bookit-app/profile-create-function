'use strict';

const { expect } = require('chai');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} = require('../../src/lib/constants').statusCodes;
const { stub } = require('sinon');
const { profiledIdMissing } = require('../../src/lib/constants').errors;
const queryProfileService = require('../../src/services/query-profile/handler');

const res = {
  send: stub(),
  sendStatus: stub(),
  status: stub()
};

const profileRepositoryMock = {
  findByProfileId: stub()
};

const logMock = {
  info: stub().resolves(),
  error: stub().resolves()
};

const handler = queryProfileService(profileRepositoryMock, logMock);

const profile = {
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
};

describe('create-profile: unit tests', () => {
  it('should throw error when required dependencies are not provided', () => {
    expect(queryProfileService).to.throw(Error);
  });

  it('should respond with a 200 and the profile', () => {
    const req = {
      header: stub().returns('TEST/TRACE'),
      query: {
        profileId: 'TEST-UID'
      }
    };

    profileRepositoryMock.findByProfileId.resolves(profile);
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(OK)).to.be.true;
      expect(res.send.calledWith(profile)).to.be.true;
    });
  });

  it('should respond with a 400 when the no query parameters are provided', () => {
    const req = {
      header: stub().returns('TEST/TRACE')
    };

    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
      expect(res.send.calledWithExactly(profiledIdMissing)).to.be.true;
    });
  });

  it('should respond with a 400 when the no profileId is provided', () => {
    const req = {
      header: stub().returns('TEST/TRACE'),
      query: {
      }
    };

    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(
      () => {
        expect(res.status.called).to.be.true;
        expect(res.status.calledWithExactly(BAD_REQUEST)).to.be.true;
        expect(res.send.calledWithExactly(profiledIdMissing)).to.be.true;
      }
    );
  });

  it('should respond with a 404 when the profile does not exist', () => {
    const req = {
      header: stub().returns('TEST/TRACE'),
      query: {
        profileId: 'TEST-UID'
      }
    };

    profileRepositoryMock.findByProfileId.resolves(undefined);
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(() => {
      expect(profileRepositoryMock.findByProfileId.calledWith(profile.uid)).to
        .be.true;
      expect(res.sendStatus.called).to.be.true;
      expect(res.sendStatus.calledWithExactly(NOT_FOUND)).to.be.true;
    });
  });

  it('should respond with a 500 something fails with the query', () => {
    const req = {
      header: stub().returns('TEST/TRACE'),
      query: {
        profileId: 'TEST-UID'
      }
    };

    profileRepositoryMock.findByProfileId.rejects(new Error('FORCED_ERROR'));
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(() => {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWithExactly(INTERNAL_SERVER_ERROR)).to.be.true;
      expect(res.send.called).to.be.true;
    });
  });
});
