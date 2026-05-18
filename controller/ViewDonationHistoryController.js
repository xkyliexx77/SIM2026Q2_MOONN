const DonationEntity = require('../entity/DonationEntity');

class ViewDonationHistoryController {
  static async view(doneeId, filters) {
    return await DonationEntity.view(doneeId, filters);
  }
}

module.exports = ViewDonationHistoryController;