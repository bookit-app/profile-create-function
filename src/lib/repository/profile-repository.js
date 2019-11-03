'use strict';

const { isEmpty, omit } = require('lodash');

const PROFILE_COLLECTION = 'profile';

function buildProfile(profile) {
  const data = omit(profile, ['uid']);

  data.gender = isEmpty(data.gender) ? 'O' : data.gender;
  data.birthday = isEmpty(data.birthday) ? '' : data.birthday;
  data.isProvider = data.isProvider === undefined ? false : data.isProvider;
  data.isSocial = data.isSocial === undefined ? false : data.isSocial;

  return data;
}

class ProfileRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create a new profile
   *
   * @param {*} profile
   * @returns
   * @memberof ProfileRepository
   */
  async create(profile) {
    await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid)
      .create(buildProfile(profile));

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

  /**
   * Query for a profile by the profileId
   * additionally options can be used to request
   * a specific sub map of the profile
   *
   * @param { select: string } profileId
   * @param {*} options
   * @returns
   * @memberof ProfileRepository
   */
  async findByProfileId(profileId) {
    const documentReference = await this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profileId)
      .get();

    if (isEmpty(documentReference) || !documentReference.exists) {
      return {};
    }
    return documentReference.data();
  }

  /**
   * Commit updates to the users profile
   *
   * @param {*} profile
   * @returns {void}
   * @memberof ProfileRepository
   */
  async update(profile) {
    const documentReference = this.firestore
      .collection(PROFILE_COLLECTION)
      .doc(profile.uid);

    return this.firestore.runTransaction(async t => {
      const document = await t.get(documentReference);

      // The profile has been deleted so nothing to update at this point
      if (isEmpty(document) || !document.exists) {
        const err = new Error('Profile Does not exist');
        err.code = 'PROFILE_NOT_EXISTING';
        return Promise.reject(err);
      }

      await t.set(documentReference, omit(profile, ['uid']), { merge: true });
    });
  }
}

module.exports = ProfileRepository;

module.exports.profileRepositoryInstance = new ProfileRepository(
  require('./firestore')
);
