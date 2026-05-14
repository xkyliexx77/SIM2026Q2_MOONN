const DonationEntity = require('../entity/DonationEntity');

class MakeDonationController {

  static async makeDonation(
    doneeId,
    fundraiserId,
    amount
  ) {

    return await DonationEntity.makeDonation(
      doneeId,
      fundraiserId,
      amount
    );
  }
}
module.exports = MakeDonationController;