const db = require('../database/db');

class FavouriteService {
  static add(userId, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, status FROM fundraisers WHERE id = ?`,
        [fundraiserId],
        (checkErr, fundraiser) => {
          if (checkErr) return reject(checkErr);
          if (!fundraiser) return reject(new Error('Fundraiser not found'));

          db.run(
            `INSERT INTO favourites (user_id, fundraiser_id) VALUES (?, ?)`,
            [userId, fundraiserId],
            function (err) {
              if (err) {
                if (err.message.includes('UNIQUE')) {
                  return reject(new Error('Already added to favourites'));
                }
                return reject(err);
              }

              db.run(
                `UPDATE fundraisers
                 SET favourite_count = favourite_count + 1
                 WHERE id = ?`,
                [fundraiserId],
                function (updateErr) {
                  if (updateErr) return reject(updateErr);
                  resolve({ success: true, message: 'Added to favourites' });
                }
              );
            }
          );
        }
      );
    });
  }

  static remove(userId, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM favourites
         WHERE user_id = ? AND fundraiser_id = ?`,
        [userId, fundraiserId],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Favourite not found'));
          }

          db.run(
            `UPDATE fundraisers
             SET favourite_count = CASE
               WHEN favourite_count > 0 THEN favourite_count - 1
               ELSE 0
             END
             WHERE id = ?`,
            [fundraiserId],
            function (updateErr) {
              if (updateErr) return reject(updateErr);
              resolve({ success: true, message: 'Removed from favourites' });
            }
          );
        }
      );
    });
  }

  static getByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT f.*
         FROM favourites fav
         JOIN fundraisers f ON fav.fundraiser_id = f.id
         WHERE fav.user_id = ?`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = FavouriteService;