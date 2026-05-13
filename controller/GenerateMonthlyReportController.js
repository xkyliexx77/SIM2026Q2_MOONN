const ReportEntity = require('../entity/ReportEntity');

class GenerateMonthlyReportController {
  static async generate() {
    return await ReportEntity.monthly();
  }
}

module.exports = GenerateMonthlyReportController;