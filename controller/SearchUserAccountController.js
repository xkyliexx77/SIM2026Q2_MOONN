const UserAccountEntity = require('../entity/UserAccountEntity');

class SearchUserAccountController {
  static async search(searchText) {
    return await UserAccountEntity.search(searchText || '');
  }
}

module.exports = SearchUserAccountController;