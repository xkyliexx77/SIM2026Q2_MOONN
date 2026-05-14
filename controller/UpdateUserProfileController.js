const UserProfileEntity = require('../entity/UserProfileEntity');

class UpdateUserProfileController {
  static async update(id, profile_name, profile_description) {
    return await UserProfileEntity.update(
      id,
      profile_name,
      profile_description
    );
  }
}

module.exports = UpdateUserProfileController;