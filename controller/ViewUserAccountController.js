const UserAccountEntity = require('../entity/UserAccountEntity');

class ViewUserAccountController {
  static async viewAll() {
    return await UserAccountEntity.viewAll();
  }
}

module.exports = ViewUserAccountController;