const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthEntity = require('../entity/AuthEntity');

const SECRET_KEY = 'fundraising_secret_key';

class LoginController {
  static async login(email, password) {
    const user = await AuthEntity.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET_KEY,
      {
        expiresIn: '24h'
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginController;