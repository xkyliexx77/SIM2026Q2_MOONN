const db = require('../database/db');

class UserAccountEntity {
  static create(data) {
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

  static viewAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM users
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE users
        SET name = ?, email = ?, role = ?
        WHERE id = ?
        `,
        [
          data.name,
          data.email,
          data.role,
          id
        ],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes
          });
        }
      );
    });
  }

  static suspend(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE users
        SET status = 'suspended'
        WHERE id = ?
        `,
        [id],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes
          });
        }
      );
    });
  }

  static search(search) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM users
        WHERE name LIKE ?
        OR email LIKE ?
        ORDER BY id DESC
        `,
        [`%${search}%`, `%${search}%`],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = UserAccountEntity;