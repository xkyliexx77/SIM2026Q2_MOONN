const db = require('../database/db');

class UserProfileEntity {
  static create(profile_name, profile_description) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO user_profiles (profile_name, profile_description, status)
        VALUES (?, ?, 'active')
        `,
        [profile_name, profile_description],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static viewOne(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT
          id,
          profile_name,
          profile_description,
          profile_description AS description,
          status
        FROM user_profiles
        WHERE id = ?
        `,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
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

  static update(id, profile_name, profile_description) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE user_profiles
        SET profile_name = ?, profile_description = ?
        WHERE id = ?
        `,
        [profile_name, profile_description, id],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
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
          resolve({ changes: this.changes });
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
        OR profile_description LIKE ?
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

module.exports = UserProfileEntity;