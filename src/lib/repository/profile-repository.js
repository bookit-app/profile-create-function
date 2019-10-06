'use strict';

const { isEmpty, omit } = require('lodash');

const PROFILE_COLLECTION = 'profile';

class ProfileRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  buildProfile(profile) {
    const data = omit(profile, ['uid']);

    data.gender = isEmpty(data.gender) ? 'O' : data.gender;
    data.birthday = isEmpty(data.birthday) ? '' : data.birthday;
    data.isProvider = data.isProvider === undefined ? false : data.isProvider;
    data.isSocial = data.isSocial === undefined ? false : data.isSocial;

    return data;
  }

  async create(profile) {
    await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .create(this.buildProfile(profile));

    return;
  }

  async findByProfileId(profileId) {
    const documentReference = await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profileId)
      .get();

    if (!isEmpty(documentReference) && documentReference.exists) {
      const profile = documentReference.data();
      profile.uid = profileId;
      return profile;
    }

    return undefined;
  }

  async update(profile) {
    await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .set(omit(profile, ['uid']), { merge: true });

    return;
  }
}

module.exports = ProfileRepository;
