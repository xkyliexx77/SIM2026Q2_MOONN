const AuthEntity = require('../entity/AuthEntity');

class LoginController {
  static async login(email, password) {
    return await AuthEntity.login(email, password);
  }
}

module.exports = LoginController;