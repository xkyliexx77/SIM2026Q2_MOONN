const db = require('../database/db');

class AuthEntity {
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
            id: this.lastID,
            message: 'User registered successfully'
          });
        }
      );
    });
  }

  static login(email, password) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
        AND status = 'active'
        `,
        [email, password],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}

module.exports = AuthEntity;