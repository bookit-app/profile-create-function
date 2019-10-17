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

    return profile.uid;
  }

  /**
   * Trigger the delete into Firestore for the document at
   * path profile/{profileId}
   *
   * @param {String} profileId
   * @returns
   * @memberof ProfileRepository
   */
  async delete(profileId) {
    await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profileId)
      .delete();

    return;
  }

  async findByProfileId(profileId, options) {
    const documentReference = await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profileId)
      .get();

    if (!isEmpty(documentReference) && documentReference.exists) {
      const profile = documentReference.data();

      if (!isEmpty(options)) {
        const data = {};
        data[options.select] = profile[options.select];
        return data;
      }

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

module.exports.profileRepositoryInstance = new ProfileRepository(
  require('./firestore')
);
