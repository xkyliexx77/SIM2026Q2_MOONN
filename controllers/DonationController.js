const DonationService = require('../services/DonationService');

class DonationController {
  static async donate(req, res) {
    try {
      const { fundraiser_id, amount } = req.body;
      const result = await DonationService.donate(req.user.id, fundraiser_id, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async mine(req, res) {
    try {
      const { category, dateFrom, dateTo } = req.query;
      const result = await DonationService.getByUser(req.user.id, category, dateFrom, dateTo);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DonationController;