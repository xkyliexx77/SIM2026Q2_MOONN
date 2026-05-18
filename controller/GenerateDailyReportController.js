const ReportEntity = require('../entity/ReportEntity');

class GenerateDailyReportController {
  static async generateDailyReport() {
    return await ReportEntity.getDailyDonationReport();
  }
}

module.exports = GenerateDailyReportController;