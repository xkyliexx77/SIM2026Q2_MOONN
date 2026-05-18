const ReportEntity = require('../entity/ReportEntity');

class CompareDonationReportController {
  static async generateDonationComparisonReport() {
    return await ReportEntity.compareDonationReports();
  }
}

module.exports = CompareDonationReportController;