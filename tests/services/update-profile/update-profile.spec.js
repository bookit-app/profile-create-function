'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub()
};
const mw = require('../../../src/services/update-profile/src/update-profile-mw')(
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
    gender: 'M',
    isProvider: false,
    phoneNumber: '123-123-1234'
  }
};

const res = {};

const next = stub();

describe('update-profile: unit tests', () => {
  afterEach(() => {
    req.body.uid = undefined;
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should respond with a 200 when profile is updated', () => {
    repoStub.update.resolves();
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith({
          address: {
            city: 'city',
            state: 'NY',
            streetAddress: 'a street somewhere',
            zip: 12345
          },
          birthday: '11-13-2019',
          gender: 'M',
          isProvider: false,
          phoneNumber: '123-123-1234',
          uid: 'TEST-USER'
        })
      ).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith({
          address: {
            city: 'city',
            state: 'NY',
            streetAddress: 'a street somewhere',
            zip: 12345
          },
          birthday: '11-13-2019',
          gender: 'M',
          isProvider: false,
          phoneNumber: '123-123-1234',
          uid: 'TEST-USER'
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
