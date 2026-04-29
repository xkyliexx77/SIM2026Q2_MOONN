const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserService {
  static getAll(search) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT id, name, email, role, COALESCE(status, 'active') AS status
        FROM users
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (name LIKE ? OR email LIKE ? OR role LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY id DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, email, password, role } = data;

        if (!name || !name.trim()) {
          return reject(new Error('Name is required'));
        }

        if (!email || !email.trim()) {
          return reject(new Error('Email is required'));
        }

        if (!password || password.length < 6) {
          return reject(new Error('Password must be at least 6 characters'));
        }

        if (!['admin', 'fundraiser', 'donee', 'manager'].includes(role)) {
          return reject(new Error('Invalid role'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          `INSERT INTO users (name, email, password, role, status)
           VALUES (?, ?, ?, ?, 'active')`,
          [name.trim(), email.trim(), hashedPassword, role],
          function (err) {
            if (err) {
              if (err.message.includes('UNIQUE')) {
                return reject(new Error('Email already exists'));
              }
              return reject(err);
            }

            resolve({
              id: this.lastID,
              name: name.trim(),
              email: email.trim(),
              role,
              status: 'active'
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { name, email, role } = data;

      if (!name || !name.trim()) {
        return reject(new Error('Name is required'));
      }

      if (!email || !email.trim()) {
        return reject(new Error('Email is required'));
      }

      if (!['admin', 'fundraiser', 'donee', 'manager'].includes(role)) {
        return reject(new Error('Invalid role'));
      }

      db.run(
        `UPDATE users
         SET name = ?, email = ?, role = ?
         WHERE id = ?`,
        [name.trim(), email.trim(), role, id],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              return reject(new Error('Email already exists'));
            }
            return reject(err);
          }

          if (this.changes === 0) {
            return reject(new Error('User not found'));
          }

          resolve({ success: true, message: 'User updated successfully' });
        }
      );
    });
  }

  static suspend(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET status = 'suspended' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('User not found'));
          }

          resolve({ success: true, message: 'User suspended successfully' });
        }
      );
    });
  }

  static activate(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET status = 'active' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('User not found'));
          }

          resolve({ success: true, message: 'User activated successfully' });
        }
      );
    });
  }
}

module.exports = UserService;