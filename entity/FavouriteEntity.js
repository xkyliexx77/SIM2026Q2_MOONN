const db = require('../database/db');

class FavouriteEntity {
  static add(userId, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM favourites
        WHERE user_id = ?
        AND fundraiser_id = ?
        `,
        [userId, fundraiserId],
        (checkErr, existing) => {
          if (checkErr) return reject(checkErr);

          if (existing) {
            return resolve({
              alreadyExists: true
            });
          }

          db.run(
            `
            INSERT INTO favourites (user_id, fundraiser_id)
            VALUES (?, ?)
            `,
            [userId, fundraiserId],
            function (err) {
              if (err) return reject(err);

              const favouriteId = this.lastID;

              db.run(
                `
                UPDATE fundraisers
                SET favourite_count = favourite_count + 1
                WHERE id = ?
                `,
                [fundraiserId],
                function (updateErr) {
                  if (updateErr) return reject(updateErr);

                  resolve({
                    id: favouriteId,
                    alreadyExists: false
                  });
                }
              );
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
          f.*
        FROM favourites fa
        LEFT JOIN fundraisers f
        ON fa.fundraiser_id = f.id
        WHERE fa.user_id = ?
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static remove(userId, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        DELETE FROM favourites
        WHERE user_id = ?
        AND fundraiser_id = ?
        `,
        [userId, fundraiserId],
        function (err) {
          if (err) return reject(err);

          if (this.changes > 0) {
            db.run(
              `
              UPDATE fundraisers
              SET favourite_count = CASE
                WHEN favourite_count > 0 THEN favourite_count - 1
                ELSE 0
              END
              WHERE id = ?
              `,
              [fundraiserId],
              () => {
                resolve({ changes: this.changes });
              }
            );
          } else {
            resolve({ changes: 0 });
          }
        }
      );
    });
  }
}

module.exports = FavouriteEntity;