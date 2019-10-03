'use strict';

import { Firestore } from '@google-cloud/firestore';
import { isEmpty } from 'lodash';

const PROFILE_COLLECTION = 'profile';

const profileRepositoryFactory = (firestore: Firestore) => {
  const createProfile = async (profile: IProfile) => {
    const result = await firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .create({
        birthday: profile.birthday,
        firstName: profile.lastName,
        gender: profile.gender,
        isProvider: profile.isProvider,
        isSocial: profile.isSocial,
        lastName: profile.firstName,
        phoneNumber: profile.phoneNumber
      });

    return;
  };

  const queryProfile = async (profileId: string) => {
    const documentReference = await firestore
      .collection(PROFILE_COLLECTION)
      .doc(profileId)
      .get();

    if (!isEmpty(documentReference) && documentReference.exists) {
      const profile = documentReference.data() as IProfile;
      profile.uid = profileId;
      return profile;
    }

    return undefined;
  };

  const repo: IProfileRepository = {
    create: createProfile,
    findByProfileId: queryProfile
  };

  return repo;
};

export interface IProfile {
  birthday: Date;
  firstName: string;
  gender: 0 | 1 | 2;
  isProvider: boolean;
  isSocial: boolean;
  lastName: string;
  phoneNumber: string;
  uid: string;
}

export interface IProfileRepository {
  create: (profile: IProfile) => Promise<void>;
  findByProfileId: (profileId: string) => Promise<IProfile | undefined>;
}

export { profileRepositoryFactory };
