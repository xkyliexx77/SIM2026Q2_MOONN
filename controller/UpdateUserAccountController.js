const UserAccountEntity = require('../entity/UserAccountEntity');

class UpdateUserAccountController {
  static async update(id, data) {
    return await UserAccountEntity.update(id, data);
  }
}

module.exports = UpdateUserAccountController;