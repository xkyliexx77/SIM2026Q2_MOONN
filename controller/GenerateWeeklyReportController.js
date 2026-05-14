const ReportEntity = require('../entity/ReportEntity');

class GenerateWeeklyReportController {
  static async generateWeeklyReport() {
    return await ReportEntity.weekly();
  }
}

module.exports = GenerateWeeklyReportController;