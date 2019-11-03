'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub()
};
const mw = require('../../../src/services/provider-create-notification-processor/src/profile-update-mw')(
  repoStub
);

const req = {
  body: {
    ownerUid: 'TEST'
  }
};

const next = stub();

describe('provider-create-notification-processor profile-update-mw unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should trigger the update of the provider', () => {
    repoStub.update.resolves();
    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith({
          uid: 'TEST',
          isProvider: true
        })
      ).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith({
          uid: 'TEST',
          isProvider: true
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });

  it('should call next when PROFILE_NOT_EXISTING error failure from repo', () => {
    const error = new Error('FORCED-ERROR');
    error.code = 'PROFILE_NOT_EXISTING';
    repoStub.update.rejects(error);

    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith({
          uid: 'TEST',
          isProvider: true
        })
      ).to.be.true;
      expect(next.called).to.be.true;
      expect(next.calledWith()).to.be.true;
    });
  });
});
