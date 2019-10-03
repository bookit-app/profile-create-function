'use strict';

import {
  CollectionReference,
  DocumentReference,
  Firestore
} from '@google-cloud/firestore';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createStubInstance } from 'sinon';
import {
  IProfile,
  IProfileRepository,
  profileRepositoryFactory
} from '../../src/repository/profile-repository';

use(chaiAsPromised);

const profile: IProfile = {
  birthday: new Date(),
  firstName: 'test-first-name',
  gender: 1,
  isProvider: false,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  uid: 'test-profile'
};

describe('profile-repository: unit tests', () => {
  let repo: IProfileRepository;
  let documentReference: any;

  before(() => {
    const collectionReference = createStubInstance(CollectionReference) as any;
    const firestore = createStubInstance(Firestore);
    documentReference = createStubInstance(DocumentReference) as any;
    collectionReference.doc.returns(documentReference as DocumentReference);
    firestore.collection.returns(collectionReference as CollectionReference);

    repo = profileRepositoryFactory(firestore as Firestore);
  });

  context('create', () => {
    it('create should resolve', () => {
      documentReference.create.resolves();
      return expect(repo.create(profile)).to.be.fulfilled;
    });
  });

  // context('query profile', () => {
  //   it('should return profile when found', () => {});
  //   it('should return undefined when no profile is found', () => {});
  // });
});
