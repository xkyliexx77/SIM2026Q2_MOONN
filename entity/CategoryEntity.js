const db = require('../database/db');

class CategoryEntity {
  static create(data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO categories (name)
        VALUES (?)
        `,
        [data.name],
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

  static update(id, data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE categories
        SET name = ?
        WHERE id = ?
        `,
        [data.name, id],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes
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
        FROM categories
        WHERE name LIKE ?
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