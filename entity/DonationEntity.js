const db = require('../database/db');

class DonationEntity {
  static donate(userId, fundraiserId, amount) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO donations
        (user_id, fundraiser_id, amount)
        VALUES (?, ?, ?)
        `,
        [
          userId,
          fundraiserId,
          amount
        ],
        function (err) {
          if (err) return reject(err);

          db.run(
            `
            UPDATE fundraisers
            SET current_amount = current_amount + ?
            WHERE id = ?
            `,
            [amount, fundraiserId],
            () => {
              resolve({
                id: this.lastID
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
          d.*,
          f.title
        FROM donations d
        LEFT JOIN fundraisers f
        ON d.fundraiser_id = f.id
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
          d.*,
          f.title
        FROM donations d
        LEFT JOIN fundraisers f
        ON d.fundraiser_id = f.id
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