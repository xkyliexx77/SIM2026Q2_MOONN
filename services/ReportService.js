const db = require('../database/db');

class ReportService {
  static getSummary() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          (SELECT COUNT(*) FROM users) AS total_users,
          (SELECT COUNT(*) FROM categories) AS total_categories,
          (SELECT COUNT(*) FROM fundraisers) AS total_fundraisers,
          (SELECT COUNT(*) FROM favourites) AS total_favourites,
          (SELECT COUNT(*) FROM donations) AS total_donations,
          (SELECT IFNULL(SUM(amount), 0) FROM donations) AS total_donation_amount`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static getDailyReport() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COUNT(*) AS donation_count,
          IFNULL(SUM(amount), 0) AS donation_amount
         FROM donations
         WHERE date(donated_at) = date('now', 'localtime')`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static getWeeklyReport() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COUNT(*) AS donation_count,
          IFNULL(SUM(amount), 0) AS donation_amount
         FROM donations
         WHERE date(donated_at) >= date('now', '-6 days', 'localtime')
           AND date(donated_at) <= date('now', 'localtime')`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static getMonthlyReport() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COUNT(*) AS donation_count,
          IFNULL(SUM(amount), 0) AS donation_amount
         FROM donations
         WHERE strftime('%Y-%m', donated_at) = strftime('%Y-%m', 'now', 'localtime')`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}

module.exports = ReportService;