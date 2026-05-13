const UserProfileEntity = require('../entity/UserProfileEntity');

class UpdateUserProfileController {
  static async update(id, data) {
    return await UserProfileEntity.update(id, data);
  }
}

module.exports = UpdateUserProfileController;