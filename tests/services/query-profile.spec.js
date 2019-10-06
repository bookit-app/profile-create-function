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
const queryProfile = require('../../src/services/query-profile/handler');

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

const profileRepositoryMock = {
  findByProfileId: stub()
};

const handler = queryProfile(profileRepositoryMock);

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
  it('should respond with a 200 and the profile', () => {
    profileRepositoryMock.findByProfileId.resolves(profile);
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(
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
    expect(handler.queryProfile({}, res)).to.be.fulfilled.then(
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
      handler.queryProfile({ query: {} }, res)
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
    profileRepositoryMock.findByProfileId.resolves(undefined);
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(
      () => {
        // tslint:disable-next-line: no-unused-expression
        expect(profileRepositoryMock.findByProfileId.calledWith(profile.uid)).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.called).to.be.true;
        // tslint:disable-next-line: no-unused-expression
        expect(res.sendStatus.calledWithExactly(NOT_FOUND)).to.be.true;
      }
    );
  });

  it('should respond with a 500 something fails with the query', () => {
    profileRepositoryMock.findByProfileId.rejects(new Error('FORCED_ERROR'));
    expect(handler.queryProfile(req, res)).to.be.fulfilled.then(
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
