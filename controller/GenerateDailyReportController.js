const ReportEntity = require('../entity/ReportEntity');

class GenerateDailyReportController {
  static async generate() {
    return await ReportEntity.daily();
  }
}

module.exports = GenerateDailyReportController;