const bcrypt = require('bcrypt');

const UserAccountEntity =
  require('../entity/UserAccountEntity');

class CreateUserAccountController {

  static async create(data) {

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    return await UserAccountEntity.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role
    });

  }

}

module.exports = CreateUserAccountController;