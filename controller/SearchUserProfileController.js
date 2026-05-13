const UserProfileEntity = require('../entity/UserProfileEntity');

class SearchUserProfileController {
  static async search(searchText) {
    return await UserProfileEntity.search(searchText || '');
  }
}

module.exports = SearchUserProfileController;