const db = require('../database/db');

class ReportEntity {
  static summary() {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT
          (SELECT COUNT(*) FROM users) AS total_users,
          (SELECT COUNT(*) FROM users WHERE role LIKE '%fundraiser%') AS total_fundraiser_users,
          (SELECT COUNT(*) FROM users WHERE role LIKE '%donee%') AS total_donees,
          (SELECT COUNT(*) FROM categories) AS total_categories,
          (SELECT COUNT(*) FROM fundraisers) AS total_fundraisers,
          (SELECT COUNT(*) FROM fundraisers WHERE status = 'active') AS active_fundraisers,
          (SELECT COUNT(*) FROM fundraisers WHERE status = 'completed') AS completed_fundraisers,
          (SELECT COUNT(*) FROM favourites) AS total_favourites,
          (SELECT COUNT(*) FROM donations) AS total_donations,
          (SELECT IFNULL(SUM(amount), 0) FROM donations) AS total_donation_amount,
          (SELECT IFNULL(AVG(amount), 0) FROM donations) AS average_donation
        `,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static daily() {
    return ReportEntity.periodReport(
      "DATE(d.donated_at) = DATE('now')",
      "DATE(f.created_at) = DATE('now')"
    );
  }

  static weekly() {
    return ReportEntity.periodReport(
      "DATE(d.donated_at) >= DATE('now', '-7 days')",
      "DATE(f.created_at) >= DATE('now', '-7 days')"
    );
  }

  static monthly() {
    return ReportEntity.periodReport(
      "strftime('%Y-%m', d.donated_at) = strftime('%Y-%m', 'now')",
      "strftime('%Y-%m', f.created_at) = strftime('%Y-%m', 'now')"
    );
  }

  static periodReport(donationCondition, fundraiserCondition) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT
          (SELECT COUNT(*) FROM donations d WHERE ${donationCondition}) AS donation_count,
          (SELECT IFNULL(SUM(d.amount), 0) FROM donations d WHERE ${donationCondition}) AS donation_amount,
          (SELECT IFNULL(AVG(d.amount), 0) FROM donations d WHERE ${donationCondition}) AS average_donation,
          (SELECT COUNT(DISTINCT d.user_id) FROM donations d WHERE ${donationCondition}) AS unique_donors,

          (SELECT COUNT(*) FROM fundraisers f WHERE ${fundraiserCondition}) AS new_fundraisers,
          (SELECT COUNT(*) FROM fundraisers WHERE status = 'active') AS active_fundraisers,
          (SELECT COUNT(*) FROM fundraisers WHERE status = 'completed') AS completed_fundraisers,
          (SELECT IFNULL(SUM(views), 0) FROM fundraisers) AS total_views,
          (SELECT COUNT(*) FROM favourites) AS total_favourites,

          (
            SELECT c.name
            FROM donations d
            LEFT JOIN fundraisers f ON d.fundraiser_id = f.id
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE ${donationCondition}
            GROUP BY c.id
            ORDER BY COUNT(d.id) DESC
            LIMIT 1
          ) AS top_category,

          (
            SELECT title
            FROM fundraisers
            ORDER BY views DESC
            LIMIT 1
          ) AS most_viewed_fundraiser,

          (
            SELECT f.title
            FROM favourites fav
            LEFT JOIN fundraisers f ON fav.fundraiser_id = f.id
            GROUP BY f.id
            ORDER BY COUNT(fav.id) DESC
            LIMIT 1
          ) AS most_favourited_fundraiser
        `,
        [],
        (err, row) => {
          if (err) return reject(err);

          resolve({
            donation_count: row.donation_count || 0,
            donation_amount: row.donation_amount || 0,
            average_donation: row.average_donation || 0,
            unique_donors: row.unique_donors || 0,
            new_fundraisers: row.new_fundraisers || 0,
            active_fundraisers: row.active_fundraisers || 0,
            completed_fundraisers: row.completed_fundraisers || 0,
            total_views: row.total_views || 0,
            total_favourites: row.total_favourites || 0,
            top_category: row.top_category || 'No category',
            most_viewed_fundraiser: row.most_viewed_fundraiser || 'No fundraiser',
            most_favourited_fundraiser: row.most_favourited_fundraiser || 'No fundraiser'
          });
        }
      );
    });
  }

  static compare() {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT
          (SELECT IFNULL(SUM(amount), 0)
           FROM donations
           WHERE DATE(donated_at) = DATE('now')) AS daily_amount,

          (SELECT IFNULL(SUM(amount), 0)
           FROM donations
           WHERE DATE(donated_at) >= DATE('now', '-7 days')) AS weekly_amount,

          (SELECT IFNULL(SUM(amount), 0)
           FROM donations
           WHERE strftime('%Y-%m', donated_at) = strftime('%Y-%m', 'now')) AS monthly_amount
        `,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}

module.exports = ReportEntity;