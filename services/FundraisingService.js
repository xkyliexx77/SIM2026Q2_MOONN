const db = require('../database/db');

class FundraisingService {
  static createFundraiser(data, fundraiserId) {
    return new Promise((resolve, reject) => {
      const { title, description, target_amount, category_id } = data;

      if (!title || !title.trim()) {
        return reject(new Error('Title is required'));
      }

      if (!description || !description.trim()) {
        return reject(new Error('Description is required'));
      }

      const numericTarget = Number(target_amount);
      if (!numericTarget || numericTarget <= 0) {
        return reject(new Error('Target amount must be greater than 0'));
      }

      if (!category_id) {
        return reject(new Error('Category is required'));
      }

      db.get(`SELECT id FROM categories WHERE id = ?`, [category_id], (catErr, category) => {
        if (catErr) return reject(catErr);
        if (!category) return reject(new Error('Selected category does not exist'));

        db.run(
          `INSERT INTO fundraisers (title, description, target_amount, category_id, fundraiser_id)
           VALUES (?, ?, ?, ?, ?)`,
          [title.trim(), description.trim(), numericTarget, category_id, fundraiserId],
          function (err) {
            if (err) return reject(err);
            resolve({
              id: this.lastID,
              title: title.trim(),
              description: description.trim(),
              target_amount: numericTarget,
              category_id,
              fundraiser_id: fundraiserId
            });
          }
        );
      });
    });
  }

  static getAll(search, category, page = 1, limit = 5) {
    return new Promise((resolve, reject) => {
      let whereQuery = ` WHERE 1=1 `;
      const params = [];

      if (search) {
        whereQuery += ` AND f.title LIKE ?`;
        params.push(`%${search}%`);
      }

      if (category) {
        whereQuery += ` AND f.category_id = ?`;
        params.push(category);
      }

      const safePage = Number(page) > 0 ? Number(page) : 1;
      const safeLimit = Number(limit) > 0 ? Number(limit) : 5;
      const offset = (safePage - 1) * safeLimit;

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM fundraisers f
        ${whereQuery}
      `;

      db.get(countQuery, params, (countErr, countRow) => {
        if (countErr) return reject(countErr);

        const dataQuery = `
          SELECT f.*, c.name AS category_name, u.name AS fundraiser_name
          FROM fundraisers f
          LEFT JOIN categories c ON f.category_id = c.id
          LEFT JOIN users u ON f.fundraiser_id = u.id
          ${whereQuery}
          ORDER BY f.id DESC
          LIMIT ? OFFSET ?
        `;

        db.all(dataQuery, [...params, safeLimit, offset], (err, rows) => {
          if (err) return reject(err);

          resolve({
            items: rows,
            total: countRow.total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(countRow.total / safeLimit) || 1
          });
        });
      });
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
        `SELECT f.id, f.title, f.description, f.target_amount, f.category_id, f.status,
                f.current_amount, f.views, f.favourite_count,
                COUNT(d.id) AS donation_count,
                IFNULL(SUM(d.amount), 0) AS total_donated
         FROM fundraisers f
         LEFT JOIN donations d ON f.id = d.fundraiser_id
         WHERE f.fundraiser_id = ?
         GROUP BY f.id
         ORDER BY f.id DESC`,
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
        SELECT f.id, f.title, f.description, f.target_amount, f.current_amount, f.status,
               f.created_at, c.name AS category_name
        FROM fundraisers f
        LEFT JOIN categories c ON f.category_id = c.id
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

  static updateFundraiser(id, ownerId, data) {
    return new Promise((resolve, reject) => {
      const { title, description, target_amount, category_id } = data;

      if (!title || !title.trim()) {
        return reject(new Error('Title is required'));
      }

      if (!description || !description.trim()) {
        return reject(new Error('Description is required'));
      }

      const numericTarget = Number(target_amount);
      if (!numericTarget || numericTarget <= 0) {
        return reject(new Error('Target amount must be greater than 0'));
      }

      if (!category_id) {
        return reject(new Error('Category is required'));
      }

      db.get(`SELECT id FROM categories WHERE id = ?`, [category_id], (catErr, category) => {
        if (catErr) return reject(catErr);
        if (!category) return reject(new Error('Selected category does not exist'));

        db.run(
          `UPDATE fundraisers
           SET title = ?, description = ?, target_amount = ?, category_id = ?
           WHERE id = ? AND fundraiser_id = ?`,
          [title.trim(), description.trim(), numericTarget, category_id, id, ownerId],
          function (err) {
            if (err) return reject(err);

            if (this.changes === 0) {
              return reject(new Error('Fundraiser not found or no permission to edit'));
            }

            resolve({
              success: true,
              message: 'Fundraiser updated successfully'
            });
          }
        );
      });
    });
  }

  static markCompleted(id, ownerId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE fundraisers
         SET status = 'completed'
         WHERE id = ? AND fundraiser_id = ?`,
        [id, ownerId],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Fundraiser not found or no permission to update'));
          }

          resolve({ success: true, message: 'Fundraiser marked as completed' });
        }
      );
    });
  }

  static deleteFundraiser(id, ownerId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM fundraisers
         WHERE id = ? AND fundraiser_id = ?`,
        [id, ownerId],
        function (err) {
          if (err) return reject(err);

          if (this.changes === 0) {
            return reject(new Error('Fundraiser not found or no permission to delete'));
          }

          resolve({
            success: true,
            message: 'Fundraiser deleted successfully'
          });
        }
      );
    });
  }
}

module.exports = FundraisingService;