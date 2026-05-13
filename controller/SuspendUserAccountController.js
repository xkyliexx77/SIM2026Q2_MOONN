const UserAccountEntity = require('../entity/UserAccountEntity');

class SuspendUserAccountController {
  static async suspend(id) {
    return await UserAccountEntity.suspend(id);
  }
}

module.exports = SuspendUserAccountController;