const DonationEntity = require('../entity/DonationEntity');

class MakeDonationController {
  static async donate(userId, fundraiserId, amount) {
    return await DonationEntity.donate(
      userId,
      fundraiserId,
      amount
    );
  }
}

module.exports = MakeDonationController;