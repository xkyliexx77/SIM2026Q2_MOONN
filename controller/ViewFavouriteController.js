const FavouriteEntity = require('../entity/FavouriteEntity');

class ViewFavouriteController {
  static async view(doneeId) {
    return await FavouriteEntity.view(doneeId);
  }
}

module.exports = ViewFavouriteController;