const DonationEntity = require('../entity/DonationEntity');

class ViewDonationHistoryController {
  static async view(doneeId) {
    return await DonationEntity.view(doneeId);
  }
}

module.exports = ViewDonationHistoryController;