'use strict';

import {
  CollectionReference,
  DocumentReference,
  Firestore
} from '@google-cloud/firestore';
import { expect } from 'chai';
import { createStubInstance } from 'sinon';
import {
  IProfile,
  IProfileRepository,
  profileRepositoryFactory
} from '../../src/repository/profile-repository';

const profile: IProfile = {
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
  isProvider: true,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  uid: 'TEST-UID'
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

    it('should enforce default values on create', () => {
      const testProfile: IProfile = {
        address: {
          city: 'city',
          state: 'NY',
          streetAddress: 'a street somewhere',
          zip: '12345'
        },
        email: 'test@test.com',
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        phoneNumber: '123-123-1234',
        uid: 'TEST-UID'
      };

      documentReference.create.resolves();
      return expect(repo.create(testProfile)).to.be.fulfilled;
    });
  });

  context('query profile', () => {
    it('should return profile when found', () => {
      documentReference.get.resolves({
        data: () => profile,
        exists: true
      });

      expect(repo.findByProfileId(profile.uid)).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal(profile);
        }
      );
    });

    it('should return undefined when no profile is found', () => {
      documentReference.get.resolves({
        // tslint:disable-next-line: no-empty
        data: () => {},
        exists: false
      });

      expect(repo.findByProfileId(profile.uid)).to.be.fulfilled.then(
        response => {
          // tslint:disable-next-line: no-unused-expression
          expect(response).to.be.undefined;
        }
      );
    });
  });

  context('replace', () => {
    it('replace should resolve', () => {
      documentReference.set.resolves();
      return expect(repo.replace(profile)).to.be.fulfilled;
    });
  });

  it('should enforce default values on replace', () => {
    const testProfile: IProfile = {
      address: {
        city: 'city',
        state: 'NY',
        streetAddress: 'a street somewhere',
        zip: '12345'
      },
      email: 'test@test.com',
      firstName: 'test-first-name',
      lastName: 'test-last-name',
      phoneNumber: '123-123-1234',
      uid: 'TEST-UID'
    };

    documentReference.set.resolves();
    return expect(repo.replace(testProfile)).to.be.fulfilled;
  });
});
