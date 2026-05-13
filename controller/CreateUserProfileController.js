const UserProfileEntity = require('../entity/UserProfileEntity');

class CreateUserProfileController {
  static async create(data) {
    return await UserProfileEntity.create(data);
  }
}

module.exports = CreateUserProfileController;