'use strict';

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import {
  Firestore,
  CollectionReference,
  DocumentReference
} from '@google-cloud/firestore';
import {
  profileRepositoryFactory,
  IProfile,
  IProfileRepository
} from '../../src/repository/profile-repository';
import { stub, createStubInstance } from 'sinon';

const profile: IProfile = {
  uid: 'test-profile',
  firstName: 'test-first-name',
  lastName: 'test-last-name',
  birthday: new Date(),
  phoneNumber: '123-123-1234',
  gender: 1,
  isSocial: true,
  isProvider: false
};

describe('profile-repository: unit tests', () => {
  let repo: IProfileRepository, documentReference: any;

  before(() => {
    const collectionReference = <any>createStubInstance(CollectionReference);
    const firestore = createStubInstance(Firestore);
    documentReference = <any>createStubInstance(DocumentReference);
    collectionReference.doc.returns(<DocumentReference>documentReference);
    firestore.collection.returns(<CollectionReference>collectionReference);

    repo = profileRepositoryFactory(<Firestore>firestore);
  });

  it('create should resolve', () => {
    documentReference.create.resolves();
    expect(repo.create(profile)).to.be.fulfilled;
  });
});
