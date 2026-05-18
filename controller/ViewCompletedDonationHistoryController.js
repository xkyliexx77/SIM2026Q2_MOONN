const DonationEntity = require('../entity/DonationEntity');

class ViewCompletedDonationHistoryController {
  static async view(doneeId, filters) {
    return await DonationEntity.viewCompleted(doneeId, filters);
  }
}

module.exports = ViewCompletedDonationHistoryController;