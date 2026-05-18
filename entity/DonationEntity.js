const db = require('../database/db');

class DonationEntity {
  static donate(userId, fundraiserId, amount) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO donations (user_id, fundraiser_id, amount)
        VALUES (?, ?, ?)
        `,
        [userId, fundraiserId, amount],
        function (err) {
          if (err) return reject(err);

          const donationId = this.lastID;

          db.run(
            `
            UPDATE fundraisers
            SET current_amount = current_amount + ?
            WHERE id = ?
            `,
            [amount, fundraiserId],
            function (updateErr) {
              if (updateErr) return reject(updateErr);

              resolve({
                id: donationId
              });
            }
          );
        }
      );
    });
  }

  static view(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT
          d.id,
          d.amount,
          d.donated_at,
          f.id AS fundraiser_id,
          f.title,
          f.description,
          f.status,
          f.current_amount,
          f.target_amount,
          c.name AS category_name
        FROM donations d
        LEFT JOIN fundraisers f ON d.fundraiser_id = f.id
        LEFT JOIN categories c ON f.category_id = c.id
        WHERE d.user_id = ?
      `;

      const params = [userId];

      if (filters.category) {
        sql += ` AND f.category_id = ?`;
        params.push(filters.category);
      }

      if (filters.dateFrom) {
        sql += ` AND DATE(d.donated_at) >= DATE(?)`;
        params.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        sql += ` AND DATE(d.donated_at) <= DATE(?)`;
        params.push(filters.dateTo);
      }

      sql += ` ORDER BY d.id DESC`;

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static viewCompleted(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT
          d.id,
          d.amount,
          d.donated_at,
          f.id AS fundraiser_id,
          f.title,
          f.description,
          f.status,
          f.current_amount,
          f.target_amount,
          c.name AS category_name
        FROM donations d
        LEFT JOIN fundraisers f ON d.fundraiser_id = f.id
        LEFT JOIN categories c ON f.category_id = c.id
        WHERE d.user_id = ?
        AND LOWER(f.status) = 'completed'
      `;

      const params = [userId];

      if (filters.category) {
        sql += ` AND f.category_id = ?`;
        params.push(filters.category);
      }

      if (filters.dateFrom) {
        sql += ` AND DATE(d.donated_at) >= DATE(?)`;
        params.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        sql += ` AND DATE(d.donated_at) <= DATE(?)`;
        params.push(filters.dateTo);
      }

      sql += ` ORDER BY d.id DESC`;

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = DonationEntity;