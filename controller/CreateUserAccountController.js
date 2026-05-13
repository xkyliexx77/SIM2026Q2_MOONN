const UserAccountEntity = require('../entity/UserAccountEntity');

class CreateUserAccountController {
  static async create(data) {
    return await UserAccountEntity.create(data);
  }
}

module.exports = CreateUserAccountController;