const FavouriteEntity = require('../entity/FavouriteEntity');

class AddFavouriteController {
  static async add(doneeId, fundraiserId) {
    return await FavouriteEntity.add(doneeId, fundraiserId);
  }
}

module.exports = AddFavouriteController;