const FavouriteEntity = require('../entity/FavouriteEntity');

class RemoveFavouriteController {
  static async remove(doneeId, fundraiserId) {
    return await FavouriteEntity.remove(doneeId, fundraiserId);
  }
}

module.exports = RemoveFavouriteController;