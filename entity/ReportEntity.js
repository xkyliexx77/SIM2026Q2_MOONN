const db = require('../database/db');

class ReportEntity {
  static daily() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM donations
        WHERE DATE(created_at) = DATE('now')
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static weekly() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM donations
        WHERE DATE(created_at) >= DATE('now', '-7 day')
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static monthly() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM donations
        WHERE DATE(created_at) >= DATE('now', '-30 day')
        `,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static compare() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT
          title,
          current_amount,
          target_amount
        FROM fundraisers
        ORDER BY current_amount DESC
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

module.exports = ReportEntity;