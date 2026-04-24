const db = require('../database/db');

class CategoryService {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM categories ORDER BY id ASC`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static create(name) {
    return new Promise((resolve, reject) => {
      if (!name || !name.trim()) {
        return reject(new Error('Category name is required'));
      }

      db.run(
        `INSERT INTO categories (name) VALUES (?)`,
        [name.trim()],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name: name.trim() });
        }
      );
    });
  }

  static update(id, name) {
    return new Promise((resolve, reject) => {
      if (!name || !name.trim()) {
        return reject(new Error('Category name is required'));
      }

      db.run(
        `UPDATE categories SET name = ? WHERE id = ?`,
        [name.trim(), id],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Category not found'));
          }

          resolve({ success: true, message: 'Category updated successfully' });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) AS count FROM fundraisers WHERE category_id = ?`,
        [id],
        (checkErr, row) => {
          if (checkErr) return reject(checkErr);

          if (row.count > 0) {
            return reject(new Error('Cannot delete category because it is linked to one or more fundraisers'));
          }

          db.run(`DELETE FROM categories WHERE id = ?`, [id], function (err) {
            if (err) return reject(err);

            if (this.changes === 0) {
              return reject(new Error('Category not found'));
            }

            resolve({ success: true, message: 'Category deleted successfully' });
          });
        }
      );
    });
  }
}

module.exports = CategoryService;