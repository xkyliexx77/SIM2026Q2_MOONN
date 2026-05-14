const FavouriteEntity = require('../entity/FavouriteEntity');

class RemoveFavouriteController {
  static async removeFavourite(
    doneeId,
    fundraiserId
  ) {
    return await FavouriteEntity.removeFavourite(
      doneeId,
      fundraiserId
    );
  }
}

module.exports = RemoveFavouriteController;