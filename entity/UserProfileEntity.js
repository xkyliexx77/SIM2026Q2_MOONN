const db = require('../database/db');

class UserProfileEntity {
  static create(data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO user_profiles (profile_name, status)
        VALUES (?, 'active')
        `,
        [data.profile_name],
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
        FROM user_profiles
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
        UPDATE user_profiles
        SET profile_name = ?
        WHERE id = ?
        `,
        [data.profile_name, id],
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
        UPDATE user_profiles
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
        FROM user_profiles
        WHERE profile_name LIKE ?
        ORDER BY id DESC
        `,
        [`%${search}%`],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = UserProfileEntity;