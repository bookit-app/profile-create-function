// 'use strict';

// import { expect, use } from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// use(chaiAsPromised);

// import { stub } from 'sinon';
// import { IHandlers, dispatch } from '../src/request-dispatcher';
// import { read } from 'fs';
// import { METHOD_NOT_ALLOWED } from 'http-status-codes';
// import { ICreateProfileHandler } from '../src/handlers/create-profile';

// const req = {
//   method: 'POST'
// };

// const res = {
//   sendStatus: stub()
// };

// const createProfileHandlerMock: ICreateProfileHandler = {
//   createProfile: stub().resolves()
// };
// const handlers: IHandlers = {
//   createProfileHandler: createProfileHandlerMock
// };

// describe('request-dispatcher: unit tests', () => {
//   it('should dispatch to createProfile for POST requests', () => {
//     expect(dispatch(req, res, handlers)).to.be.fulfilled;
//   });

//   it('should raise METHOD_NOT_ALLOWED for anything else', () => {
//     req.method = 'BATCH';
//     expect(dispatch(req, res, handlers)).to.be.fulfilled.then(() => {
//       expect(res.sendStatus.called).to.be.true;
//       expect(res.sendStatus.calledWith(METHOD_NOT_ALLOWED)).to.be.true;
//     });
//   });
// });
