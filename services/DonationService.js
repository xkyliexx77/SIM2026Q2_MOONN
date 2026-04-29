const db = require('../database/db');

class DonationService {
  static donate(userId, fundraiserId, amount) {
    return new Promise((resolve, reject) => {
      const numericAmount = Number(amount);

      if (!fundraiserId) {
        return reject(new Error('Fundraiser is required'));
      }

      if (!numericAmount || numericAmount <= 0) {
        return reject(new Error('Donation amount must be greater than 0'));
      }

      db.get(
        `SELECT id, status, target_amount, current_amount
         FROM fundraisers
         WHERE id = ?`,
        [fundraiserId],
        (checkErr, fundraiser) => {
          if (checkErr) return reject(checkErr);

          if (!fundraiser) {
            return reject(new Error('Fundraiser not found'));
          }

          if (String(fundraiser.status).toLowerCase() === 'completed') {
            return reject(new Error('Cannot donate to a completed fundraiser'));
          }

          db.run('BEGIN TRANSACTION');

          db.run(
            `INSERT INTO donations (user_id, fundraiser_id, amount)
             VALUES (?, ?, ?)`,
            [userId, fundraiserId, numericAmount],
            function (insertErr) {
              if (insertErr) {
                db.run('ROLLBACK');
                return reject(insertErr);
              }

              db.run(
                `UPDATE fundraisers
                 SET current_amount = IFNULL(current_amount, 0) + ?
                 WHERE id = ?`,
                [numericAmount, fundraiserId],
                function (updateErr) {
                  if (updateErr) {
                    db.run('ROLLBACK');
                    return reject(updateErr);
                  }

                  db.get(
                    `SELECT current_amount, target_amount
                     FROM fundraisers
                     WHERE id = ?`,
                    [fundraiserId],
                    (readErr, updatedFundraiser) => {
                      if (readErr) {
                        db.run('ROLLBACK');
                        return reject(readErr);
                      }

                      db.run('COMMIT');

                      resolve({
                        success: true,
                        message: 'Donation successful',
                        donation_id: this.lastID,
                        current_amount: updatedFundraiser.current_amount,
                        target_amount: updatedFundraiser.target_amount
                      });
                    }
                  );
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
        SELECT 
          d.id,
          d.amount,
          d.donated_at,
          f.title,
          f.current_amount,
          f.target_amount,
          c.name AS category_name
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