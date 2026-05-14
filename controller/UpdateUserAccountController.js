const UserAccountEntity = require('../entity/UserAccountEntity');

class UpdateUserAccountController {
  static async update(id, name, email, role) {
    return await UserAccountEntity.update(id, name, email, role);
  }
}

module.exports = UpdateUserAccountController;