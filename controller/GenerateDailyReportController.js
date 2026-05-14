const ReportEntity = require('../entity/ReportEntity');

class GenerateDailyReportController {
  static async generateDailyReport() {
    return await ReportEntity.daily();
  }
}
module.exports = GenerateDailyReportController;