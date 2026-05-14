const bcrypt = require('bcrypt');
const UserAccountEntity = require('../entity/UserAccountEntity');

class CreateUserAccountController {
  static async create(name, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await UserAccountEntity.create(
      name,
      email,
      hashedPassword,
      role
    );
  }
}

module.exports = CreateUserAccountController;