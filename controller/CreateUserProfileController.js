const UserProfileEntity = require('../entity/UserProfileEntity');

class CreateUserProfileController {
  static async create(profile_name, profile_description) {
    return await UserProfileEntity.create(profile_name, profile_description);
  }
}

module.exports = CreateUserProfileController;