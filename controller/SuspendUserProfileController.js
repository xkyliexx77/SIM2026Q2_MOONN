const UserProfileEntity = require('../entity/UserProfileEntity');

class SuspendUserProfileController {
  static async suspend(id) {
    return await UserProfileEntity.suspend(id);
  }
}

module.exports = SuspendUserProfileController;