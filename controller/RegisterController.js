const AuthEntity = require('../entity/AuthEntity');

class RegisterController {
  static async register(data) {
    return await AuthEntity.register(data);
  }
}

module.exports = RegisterController;