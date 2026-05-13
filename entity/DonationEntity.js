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

  static view(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
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
        ORDER BY d.id DESC
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static viewCompleted(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
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
        AND f.status = 'completed'
        ORDER BY d.id DESC
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = DonationEntity;