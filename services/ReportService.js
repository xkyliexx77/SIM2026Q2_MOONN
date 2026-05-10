const db = require('../database/db');

class ReportService {
  static getOne(query, params = []) {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static getSummary() {
    return this.getOne(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'fundraiser') AS total_fundraiser_users,
        (SELECT COUNT(*) FROM users WHERE role = 'donee') AS total_donees,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM fundraisers) AS total_fundraisers,
        (SELECT COUNT(*) FROM fundraisers WHERE status = 'active') AS active_fundraisers,
        (SELECT COUNT(*) FROM fundraisers WHERE status = 'completed') AS completed_fundraisers,
        (SELECT COUNT(*) FROM favourites) AS total_favourites,
        (SELECT COUNT(*) FROM donations) AS total_donations,
        (SELECT IFNULL(SUM(amount), 0) FROM donations) AS total_donation_amount,
        (SELECT IFNULL(AVG(amount), 0) FROM donations) AS average_donation
    `);
  }

  static getPeriodReport(period) {
    let donationCondition = '';
    let fundraiserCondition = '';

    if (period === 'daily') {
      donationCondition = "date(d.donated_at) = date('now', 'localtime')";
      fundraiserCondition = "date(f.created_at) = date('now', 'localtime')";
    }

    if (period === 'weekly') {
      donationCondition = "date(d.donated_at) >= date('now', '-6 days', 'localtime') AND date(d.donated_at) <= date('now', 'localtime')";
      fundraiserCondition = "date(f.created_at) >= date('now', '-6 days', 'localtime') AND date(f.created_at) <= date('now', 'localtime')";
    }

    if (period === 'monthly') {
      donationCondition = "strftime('%Y-%m', d.donated_at) = strftime('%Y-%m', 'now', 'localtime')";
      fundraiserCondition = "strftime('%Y-%m', f.created_at) = strftime('%Y-%m', 'now', 'localtime')";
    }

    return this.getOne(`
      SELECT
        COUNT(DISTINCT d.id) AS donation_count,
        IFNULL(SUM(d.amount), 0) AS donation_amount,
        IFNULL(AVG(d.amount), 0) AS average_donation,
        COUNT(DISTINCT d.user_id) AS unique_donors,

        (SELECT COUNT(*)
         FROM fundraisers f
         WHERE ${fundraiserCondition}) AS new_fundraisers,

        (SELECT COUNT(*)
         FROM fundraisers f
         WHERE status = 'active') AS active_fundraisers,

        (SELECT COUNT(*)
         FROM fundraisers f
         WHERE status = 'completed') AS completed_fundraisers,

        (SELECT IFNULL(SUM(views), 0)
         FROM fundraisers) AS total_views,

        (SELECT IFNULL(SUM(favourite_count), 0)
         FROM fundraisers) AS total_favourites,

        (SELECT c.name
         FROM categories c
         JOIN fundraisers f ON f.category_id = c.id
         GROUP BY c.id
         ORDER BY COUNT(f.id) DESC
         LIMIT 1) AS top_category,

        (SELECT title
         FROM fundraisers
         ORDER BY views DESC
         LIMIT 1) AS most_viewed_fundraiser,

        (SELECT IFNULL(views, 0)
         FROM fundraisers
         ORDER BY views DESC
         LIMIT 1) AS most_viewed_count,

        (SELECT title
         FROM fundraisers
         ORDER BY favourite_count DESC
         LIMIT 1) AS most_favourited_fundraiser,

        (SELECT IFNULL(favourite_count, 0)
         FROM fundraisers
         ORDER BY favourite_count DESC
         LIMIT 1) AS most_favourited_count

      FROM donations d
      WHERE ${donationCondition}
    `);
  }

  static getDailyReport() {
    return this.getPeriodReport('daily');
  }

  static getWeeklyReport() {
    return this.getPeriodReport('weekly');
  }

  static getMonthlyReport() {
    return this.getPeriodReport('monthly');
  }

  static getDonationComparison() {
    return this.getOne(`
      SELECT
        (SELECT IFNULL(SUM(amount), 0)
         FROM donations
         WHERE date(donated_at) = date('now', 'localtime')) AS daily_amount,

        (SELECT IFNULL(SUM(amount), 0)
         FROM donations
         WHERE date(donated_at) >= date('now', '-6 days', 'localtime')
           AND date(donated_at) <= date('now', 'localtime')) AS weekly_amount,

        (SELECT IFNULL(SUM(amount), 0)
         FROM donations
         WHERE strftime('%Y-%m', donated_at) = strftime('%Y-%m', 'now', 'localtime')) AS monthly_amount
    `);
  }
}

module.exports = ReportService;