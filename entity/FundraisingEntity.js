const db = require('../database/db');

class FundraisingEntity {
  static create(data, fundraiserId) {
    return new Promise((resolve, reject) => {
      const { title, description, target_amount, category_id } = data;

      db.run(
        `INSERT INTO fundraisers 
         (title, description, target_amount, category_id, fundraiser_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          title.trim(),
          description.trim(),
          Number(target_amount),
          category_id,
          fundraiserId
        ],
        function (err) {
          if (err) return reject(err);

          resolve({
            id: this.lastID,
            message: 'Fundraiser created successfully'
          });
        }
      );
    });
  }

  static getAll(search, category, limit = 100) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name,
          COUNT(d.id) AS donation_count
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        LEFT JOIN donations d ON f.id = d.fundraiser_id
        WHERE LOWER(f.status) = 'active'
      `;

      const params = [];

      if (search) {
        query += ` AND f.title LIKE ?`;
        params.push(`%${search}%`);
      }

      if (category) {
        query += ` AND f.category_id = ?`;
        params.push(category);
      }

      query += `
        GROUP BY f.id
        ORDER BY f.id DESC
        LIMIT ?
      `;

      params.push(limit);

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getById(id) {
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

  static incrementView(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE fundraisers SET views = views + 1 WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);
          resolve({ success: true });
        }
      );
    });
  }

  static getMine(ownerId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name,
          COUNT(d.id) AS donation_count,
          IFNULL(SUM(d.amount), 0) AS total_donated
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        LEFT JOIN donations d ON f.id = d.fundraiser_id
        WHERE f.fundraiser_id = ?
        GROUP BY f.id
        ORDER BY f.id DESC
        `,
        [ownerId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static getCompleted(ownerId, category, dateFrom, dateTo) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        WHERE f.fundraiser_id = ? AND f.status = 'completed'
      `;

      const params = [ownerId];

      if (category) {
        query += ` AND f.category_id = ?`;
        params.push(category);
      }

      if (dateFrom) {
        query += ` AND date(f.created_at) >= date(?)`;
        params.push(dateFrom);
      }

      if (dateTo) {
        query += ` AND date(f.created_at) <= date(?)`;
        params.push(dateTo);
      }

      query += ` ORDER BY f.id DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static update(id, ownerId, data) {
    return new Promise((resolve, reject) => {
      const { title, description, target_amount, category_id } = data;

      db.run(
        `
        UPDATE fundraisers
        SET title = ?, description = ?, target_amount = ?, category_id = ?
        WHERE id = ? 
        AND fundraiser_id = ?
        AND status != 'completed'
        `,
        [
          title.trim(),
          description.trim(),
          Number(target_amount),
          category_id,
          id,
          ownerId
        ],
        function (err) {
          if (err) return reject(err);

          resolve({
            success: this.changes > 0,
            message:
              this.changes > 0
                ? 'Fundraiser updated successfully'
                : 'Fundraiser cannot be updated'
          });
        }
      );
    });
  }

  static markCompleted(id, ownerId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE fundraisers
        SET status = 'completed'
        WHERE id = ? AND fundraiser_id = ?
        `,
        [id, ownerId],
        function (err) {
          if (err) return reject(err);

          resolve({
            success: this.changes > 0,
            message: 'Fundraiser marked as completed'
          });
        }
      );
    });
  }

  static delete(id, ownerId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        DELETE FROM fundraisers
        WHERE id = ? 
        AND fundraiser_id = ?
        AND status != 'completed'
        `,
        [id, ownerId],
        function (err) {
          if (err) return reject(err);

          resolve({
            success: this.changes > 0,
            message:
              this.changes > 0
                ? 'Fundraiser deleted successfully'
                : 'Fundraiser cannot be deleted'
          });
        }
      );
    });
  }

  static getRecommendations(doneeId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          f.*,
          c.name AS category_name,
          u.name AS fundraiser_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
        LEFT JOIN users u ON f.fundraiser_id = u.id
        WHERE f.status = 'active'
        ORDER BY f.favourite_count DESC, f.views DESC, f.id DESC
        LIMIT 6
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = FundraisingEntity;