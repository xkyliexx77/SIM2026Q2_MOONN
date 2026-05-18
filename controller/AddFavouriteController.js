const FavouriteEntity = require('../entity/FavouriteEntity');

class AddFavouriteController {
  static async add(userId, fundraiserId) {
    return await FavouriteEntity.add(userId, fundraiserId);
  }
}

module.exports = AddFavouriteController;