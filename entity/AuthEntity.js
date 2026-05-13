const db = require('../database/db');

class AuthEntity {
  static findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM users
        WHERE email = ?
        AND status = 'active'
        `,
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static register(data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO users (name, email, password, role, status)
        VALUES (?, ?, ?, ?, 'active')
        `,
        [
          data.name,
          data.email,
          data.password,
          data.role
        ],
        function (err) {
          if (err) return reject(err);

          resolve({
            id: this.lastID
          });
        }
      );
    });
  }
}

module.exports = AuthEntity;