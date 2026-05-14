const AuthEntity = require('../entity/AuthEntity');

class RegisterController {
  static async register(name, email, password, role) {
    return await AuthEntity.register(name, email, password, role);
  }
}

module.exports = RegisterController;