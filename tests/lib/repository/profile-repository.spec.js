'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const ProfileRepository = require('../../../src/lib/repository/profile-repository');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');

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
  isProvider: true,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  uid: 'TEST-UID'
};

describe('profile-repository: unit tests', () => {
  let repo;
  let collectionReference, documentReference;

  before(() => {
    const firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    firestore.collection.returns(collectionReference);

    repo = new ProfileRepository(firestore);
  });

  afterEach(() => {
    documentReference.get.resetHistory();
    documentReference.set.resetHistory();
    documentReference.delete.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.doc.resetHistory();
  });

  context('create', () => {
    it('create should resolve', () => {
      documentReference.create.resolves();
      return expect(repo.create(profile)).to.be.fulfilled;
    });

    it('should enforce default values on create', () => {
      const testProfile = {
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
      return expect(repo.create(testProfile)).to.be.fulfilled.then(
        () =>
          expect(
            documentReference.create.calledWith({
              address: {
                city: 'city',
                state: 'NY',
                streetAddress: 'a street somewhere',
                zip: '12345'
              },
              birthday: '',
              email: 'test@test.com',
              firstName: 'test-first-name',
              gender: 'O',
              isProvider: false,
              isSocial: false,
              lastName: 'test-last-name',
              phoneNumber: '123-123-1234'
            })
          ).to.be.true
      );
    });
  });

  context('delete', () => {
    it('should resolve', () => {
      documentReference.delete.resolves();
      return expect(repo.delete(profile.uid)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith(profile.uid)).to.be.true;
      });
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

    it('should return profile the request sub components when found', () => {
      documentReference.get.resolves({
        data: () => profile,
        exists: true
      });

      expect(
        repo.findByProfileId(profile.uid, { select: 'address' })
      ).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({
          address: {
            city: 'city',
            state: 'NY',
            streetAddress: 'a street somewhere',
            zip: '12345'
          }
        });
      });
    });

    it('should return nothing if the request sub components are not found', () => {
      documentReference.get.resolves({
        data: () => profile,
        exists: true
      });

      expect(
        repo.findByProfileId(profile.uid, { select: 'test' })
      ).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({});
      });
    });

    it('should return undefined when no profile is found', () => {
      documentReference.get.resolves({
        data: () => {},
        exists: false
      });

      expect(repo.findByProfileId(profile.uid)).to.be.fulfilled.then(
        response => {
          expect(response).to.be.undefined;
        }
      );
    });
  });

  context('update', () => {
    it('should resolve', () => {
      documentReference.set.resolves();
      expect(repo.update(profile)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith(profile.uid)).to.be.true;
        expect(
          documentReference.set.calledWith({
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
            phoneNumber: '123-123-1234'
          })
        ).to.be.true;
      });
    });
  });
});
