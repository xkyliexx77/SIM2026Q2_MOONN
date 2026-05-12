const db = require('../database/db');

class ProfileService {
  static create(profileName, role) {
    return new Promise((resolve, reject) => {
      if (!profileName || !profileName.trim()) {
        return reject(new Error('Profile name is required'));
      }

      if (!role || !role.trim()) {
        return reject(new Error('Role is required'));
      }

      db.run(
        `INSERT INTO user_profiles (profile_name, role, status)
         VALUES (?, ?, 'active')`,
        [profileName.trim(), role.trim()],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              return reject(new Error('Profile name already exists'));
            }

            return reject(err);
          }

          resolve({
            id: this.lastID,
            profile_name: profileName.trim(),
            role: role.trim(),
            status: 'active'
          });
        }
      );
    });
  }

  static getAll(search) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT id, profile_name, role, status
        FROM user_profiles
        WHERE 1 = 1
      `;

      const params = [];

      if (search) {
        query += `
          AND (
            profile_name LIKE ?
            OR role LIKE ?
            OR status LIKE ?
          )
        `;

        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY id DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getActive() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT id, profile_name, role, status
        FROM user_profiles
        WHERE status = 'active'
        ORDER BY profile_name ASC
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static update(id, profileName, role) {
    return new Promise((resolve, reject) => {
      if (!profileName || !profileName.trim()) {
        return reject(new Error('Profile name is required'));
      }

      if (!role || !role.trim()) {
        return reject(new Error('Role is required'));
      }

      db.run(
        `
        UPDATE user_profiles
        SET profile_name = ?, role = ?
        WHERE id = ?
        `,
        [profileName.trim(), role.trim(), id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Profile not found'));
          }

          resolve({ message: 'Profile updated successfully' });
        }
      );
    });
  }

  static suspend(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE user_profiles SET status = 'suspended' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Profile not found'));
          }

          resolve({ message: 'Profile suspended successfully' });
        }
      );
    });
  }

  static activate(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE user_profiles SET status = 'active' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Profile not found'));
          }

          resolve({ message: 'Profile activated successfully' });
        }
      );
    });
  }
}

module.exports = ProfileService;