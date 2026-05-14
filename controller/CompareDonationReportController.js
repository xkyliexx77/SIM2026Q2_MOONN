const ReportEntity = require('../entity/ReportEntity');

class CompareDonationReportController {

  static async generateDonationComparisonReport() {
    return await ReportEntity.compare();

  }

}

module.exports = CompareDonationReportController;