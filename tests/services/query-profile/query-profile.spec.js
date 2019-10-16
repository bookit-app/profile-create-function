'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByProfileId: stub()
};
const mw = require('../../../src/services/query-profile/src/query-profile-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  }
};

const sendStub = stub();
const res = {
  status: stub().returns({ send: sendStub }),
  sendStatus: sendStub
};

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
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234'
};

const next = stub();

afterEach(() => {
  sendStub.resetHistory();
  res.status.resetHistory();
  next.resetHistory();
});

describe('query-profile unit tests', () => {
  it('should respond with OK and the profile when found', async () => {
    repoStub.findByProfileId.resolves(profile);
    await mw(req, res, next);
    expect(repoStub.findByProfileId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.calledWith(profile));
    expect(res.status.calledWith(200));
    expect(next.called).to.be.false;
  });

  it('should respond with NOT_FOUND when no profile is found', async () => {
    repoStub.findByProfileId.resolves(undefined);
    await mw(req, res, next);
    expect(repoStub.findByProfileId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.calledWith(404));
    expect(next.called).to.be.false;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByProfileId.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByProfileId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
