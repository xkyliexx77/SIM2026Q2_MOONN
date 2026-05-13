const DonationEntity = require('../entity/DonationEntity');

class MakeDonationController {
  static async donate(doneeId, fundraiserId, amount) {
    return await DonationEntity.donate(doneeId, fundraiserId, amount);
  }
}

module.exports = MakeDonationController;