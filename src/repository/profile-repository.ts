'use strict';

import { Firestore } from '@google-cloud/firestore';
import { isEmpty, omit } from 'lodash';

const PROFILE_COLLECTION = 'profile';

function buildProfile(profile: IProfile) {
  const data = omit(profile, ['uid']);

  data.gender = isEmpty(data.gender) ? 'O' : data.gender;
  data.birthday = isEmpty(data.birthday) ? '' : data.birthday;
  data.isProvider = data.isProvider === undefined ? false : data.isProvider;
  data.isSocial = data.isSocial === undefined ? false : data.isSocial;

  return data;
}

const profileRepositoryFactory = (firestore: Firestore) => {
  const createProfile = async (profile: IProfile) => {
    await firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .create(buildProfile(profile));

    return;
  };

  const replaceProfile = async (profile: IProfile) => {
    await firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .set(buildProfile(profile), { merge: true });

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
    findByProfileId: queryProfile,
    replace: replaceProfile
  };

  return repo;
};

export interface IProfile {
  address?: {
    city: string;
    state: string;
    streetAddress: string;
    zip: string;
  };
  birthday?: string;
  email: string;
  firstName: string;
  gender?: 'M' | 'F' | 'O';
  isProvider?: boolean;
  isSocial?: boolean;
  lastName: string;
  phoneNumber?: string;
  uid: string;
}

export interface IProfileRepository {
  create: (profile: IProfile) => Promise<void>;
  findByProfileId: (profileId: string) => Promise<IProfile | undefined>;
  replace: (profile: IProfile) => Promise<void>;
}

export { profileRepositoryFactory };
