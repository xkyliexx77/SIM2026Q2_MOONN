const FavouriteService = require('../services/FavouriteService');

class FavouriteController {
  static async add(req, res) {
    try {
      const result = await FavouriteService.add(req.user.id, req.body.fundraiser_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async remove(req, res) {
    try {
      const result = await FavouriteService.remove(req.user.id, req.params.fundraiserId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async mine(req, res) {
    try {
      const result = await FavouriteService.getByUser(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FavouriteController;