const ReportEntity = require('../entity/ReportEntity');

class CompareDonationReportController {
  static async compare() {
    return await ReportEntity.compare();
  }
}

module.exports = CompareDonationReportController;