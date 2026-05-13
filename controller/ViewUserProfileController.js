const UserProfileEntity = require('../entity/UserProfileEntity');

class ViewUserProfileController {
  static async viewAll() {
    return await UserProfileEntity.viewAll();
  }
}

module.exports = ViewUserProfileController;