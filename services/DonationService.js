const db = require('../database/db');

class DonationService {
  static donate(userId, fundraiserId, amount) {
    return new Promise((resolve, reject) => {
      const numericAmount = Number(amount);

      if (!numericAmount || numericAmount <= 0) {
        return reject(new Error('Donation amount must be greater than 0'));
      }

      db.get(
        `SELECT id, status FROM fundraisers WHERE id = ?`,
        [fundraiserId],
        (checkErr, fundraiser) => {
          if (checkErr) return reject(checkErr);
          if (!fundraiser) return reject(new Error('Fundraiser not found'));
          if (fundraiser.status === 'completed') {
            return reject(new Error('Cannot donate to a completed fundraiser'));
          }

          db.run(
            `INSERT INTO donations (user_id, fundraiser_id, amount) VALUES (?, ?, ?)`,
            [userId, fundraiserId, numericAmount],
            function (err) {
              if (err) return reject(err);

              db.run(
                `UPDATE fundraisers
                 SET current_amount = current_amount + ?
                 WHERE id = ?`,
                [numericAmount, fundraiserId],
                function (updateErr) {
                  if (updateErr) return reject(updateErr);
                  resolve({ success: true, message: 'Donation successful' });
                }
              );
            }
          );
        }
      );
    });
  }

  static getByUser(userId, category, dateFrom, dateTo) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT d.id, d.amount, d.donated_at, f.title, c.name AS category_name
        FROM donations d
        JOIN fundraisers f ON d.fundraiser_id = f.id
        LEFT JOIN categories c ON f.category_id = c.id
        WHERE d.user_id = ?
      `;
      const params = [userId];

      if (category) {
        query += ` AND f.category_id = ?`;
        params.push(category);
      }

      if (dateFrom) {
        query += ` AND date(d.donated_at) >= date(?)`;
        params.push(dateFrom);
      }

      if (dateTo) {
        query += ` AND date(d.donated_at) <= date(?)`;
        params.push(dateTo);
      }

      query += ` ORDER BY d.donated_at DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = DonationService;