const db = require('../database/db');

class FundraisingActivityEntity {
  static create(data, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO fundraisers
        (
          title,
          description,
          target_amount,
          current_amount,
          category_id,
          fundraiser_id,
          status,
          views,
          favourite_count
        )
        VALUES (?, ?, ?, 0, ?, ?, 'active', 0, 0)
        `,
        [
          data.title,
          data.description,
          data.target_amount,
          data.category_id,
          fundraiserId
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

  static viewOne(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        WHERE f.id = ?
        `,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static viewMine(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT
          f.*,
          c.name AS category_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        WHERE fundraiser_id = ?
        ORDER BY id DESC
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static update(id, userId, data) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE fundraisers
        SET
          title = ?,
          description = ?,
          target_amount = ?,
          category_id = ?
        WHERE id = ?
        AND fundraiser_id = ?
        AND status != 'completed'
        `,
        [
          data.title,
          data.description,
          data.target_amount,
          data.category_id,
          id,
          userId
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

  static delete(id, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        DELETE FROM fundraisers
        WHERE id = ?
        AND fundraiser_id = ?
        AND status != 'completed'
        `,
        [id, userId],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes
          });
        }
      );
    });
  }

  static complete(id, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE fundraisers
        SET status = 'completed'
        WHERE id = ?
        AND fundraiser_id = ?
        `,
        [id, userId],
        function (err) {
          if (err) return reject(err);

          resolve({
            changes: this.changes
          });
        }
      );
    });
  }

  static search(query) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        WHERE f.status = 'active'
      `;

      const params = [];

      if (query.search) {
        sql += ` AND f.title LIKE ?`;
        params.push(`%${query.search}%`);
      }

      if (query.category) {
        sql += ` AND f.category_id = ?`;
        params.push(query.category);
      }

      sql += ` ORDER BY f.id DESC`;

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = FundraisingActivityEntity;