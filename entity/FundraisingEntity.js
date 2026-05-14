const db = require('../database/db');

class FundraisingEntity {
  static create(title, description, target_amount, category_id, fundraiserId) {
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
        [title, description, target_amount, category_id, fundraiserId],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static viewOne(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE fundraisers
        SET views = views + 1
        WHERE id = ?
        `,
        [id],
        (updateErr) => {
          if (updateErr) return reject(updateErr);

          db.get(
            `
            SELECT
              f.*,
              c.name AS category_name,
              u.name AS fundraiser_name,
              COUNT(DISTINCT d.id) AS donation_count,
              COUNT(DISTINCT fav.id) AS favourite_count
            FROM fundraisers f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN users u ON f.fundraiser_id = u.id
            LEFT JOIN donations d ON d.fundraiser_id = f.id
            LEFT JOIN favourites fav ON fav.fundraiser_id = f.id
            WHERE f.id = ?
            GROUP BY f.id
            `,
            [id],
            (err, row) => {
              if (err) return reject(err);
              resolve(row);
            }
          );
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
          c.name AS category_name,
          u.name AS fundraiser_name,
          COUNT(DISTINCT d.id) AS donation_count,
          COUNT(DISTINCT fav.id) AS favourite_count
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        LEFT JOIN donations d ON d.fundraiser_id = f.id
        LEFT JOIN favourites fav ON fav.fundraiser_id = f.id
        WHERE f.fundraiser_id = ?
        GROUP BY f.id
        ORDER BY f.id DESC
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static update(id, userId, title, description, target_amount, category_id) {
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
        [title, description, target_amount, category_id, id, userId],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
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
          resolve({ changes: this.changes });
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
          resolve({ changes: this.changes });
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
          u.name AS fundraiser_name,
          COUNT(DISTINCT d.id) AS donation_count,
          COUNT(DISTINCT fav.id) AS favourite_count
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        LEFT JOIN donations d ON d.fundraiser_id = f.id
        LEFT JOIN favourites fav ON fav.fundraiser_id = f.id
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

      sql += `
        GROUP BY f.id
        ORDER BY f.id DESC
      `;

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = FundraisingEntity;