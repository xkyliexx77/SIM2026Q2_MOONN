const FavouriteEntity = require('../entity/FavouriteEntity');

class AddFavouriteController {
  static async addFavourite(
    doneeId,
    fundraiserId
  ) {
    return await FavouriteEntity.addFavourite(
      doneeId,
      fundraiserId
    );
  }
}
module.exports = AddFavouriteController;