'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../../src/services/create-profile/src/create-profile-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  body: {
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
    lastName: 'test-last-name',
    phoneNumber: '123-123-1234'
  }
};

const res = {
  location: stub()
};

const next = stub();

describe('create-profile: unit tests', () => {
  afterEach(() => {
    req.body.uid = undefined;
    next.resetHistory();
    res.location.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should respond with a 201 when profile is created', () => {
    repoStub.create.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
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
          lastName: 'test-last-name',
          phoneNumber: '123-123-1234',
          uid: 'TEST-USER'
        })
      ).to.be.true;
      expect(res.location.calledWith('/profile/DOC-ID')).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
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
          lastName: 'test-last-name',
          phoneNumber: '123-123-1234',
          uid: 'TEST-USER'
        })
      ).to.be.true;
      expect(res.location.called).to.be.false;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
