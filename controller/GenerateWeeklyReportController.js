const ReportEntity = require('../entity/ReportEntity');

class GenerateWeeklyReportController {
  static async generate() {
    return await ReportEntity.weekly();
  }
}

module.exports = GenerateWeeklyReportController;