const db = require('../database/db');

class FavouriteEntity {
  static add(userId, fundraiserId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO favourites
        (user_id, fundraiser_id)
        VALUES (?, ?)
        `,
        [userId, fundraiserId],
        function (err) {
          if (err) return reject(err);

          db.run(
            `
            UPDATE fundraisers
            SET favourite_count = favourite_count + 1
            WHERE id = ?
            `,
            [fundraiserId],
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

          resolve({
            changes: this.changes
          });
        }
      );
    });
  }
}

module.exports = FavouriteEntity;