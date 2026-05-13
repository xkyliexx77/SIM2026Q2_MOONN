const DonationEntity = require('../entity/DonationEntity');

class ViewCompletedDonationHistoryController {
  static async view(doneeId) {
    return await DonationEntity.viewCompleted(doneeId);
  }
}

module.exports = ViewCompletedDonationHistoryController;