const db = require('../database/db');

class CategoryEntity {
  static create(category) {
    return new Promise((resolve, reject) => {
      const name = category.name;
      const description = category.description || '';

      db.run(
        `
        INSERT INTO categories (name, description)
        VALUES (?, ?)
        `,
        [name, description],
        function (err) {
          if (err) return reject(err);

          resolve({
            id: this.lastID,
            name,
            description
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
        FROM categories
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

  static viewOne(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM categories
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

  static update(id, category) {
    return new Promise((resolve, reject) => {
      const name = category.name;
      const description = category.description || '';

      db.run(
        `
        UPDATE categories
        SET name = ?, description = ?
        WHERE id = ?
        `,
        [name, description, id],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes,
            id,
            name,
            description
          });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        DELETE FROM categories
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
        FROM categories
        WHERE name LIKE ?
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

module.exports = CategoryEntity;