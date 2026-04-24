const ReportService = require('../services/ReportService');

class ReportController {
  static async summary(req, res) {
    try {
      const result = await ReportService.getSummary();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async daily(req, res) {
    try {
      const result = await ReportService.getDailyReport();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async weekly(req, res) {
    try {
      const result = await ReportService.getWeeklyReport();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async monthly(req, res) {
    try {
      const result = await ReportService.getMonthlyReport();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportController;