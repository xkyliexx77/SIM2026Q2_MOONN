const ReportEntity = require('../entity/ReportEntity');

class GenerateMonthlyReportController {
  static async generateMonthlyReport() {
    return await ReportEntity.getMonthlyDonationReport();
  }
}

module.exports = GenerateMonthlyReportController;