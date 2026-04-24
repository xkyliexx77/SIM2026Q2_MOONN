const FundraisingService = require('../services/FundraisingService');

class FundraisingController {
  static async create(req, res) {
    try {
      const fundraiser = await FundraisingService.createFundraiser(req.body, req.user.id);
      res.status(201).json(fundraiser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { search, category } = req.query;
      const fundraisers = await FundraisingService.getAll(search, category);
      res.json(fundraisers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addView(req, res) {
    try {
      const result = await FundraisingService.incrementView(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async mine(req, res) {
    try {
      const result = await FundraisingService.getMine(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async completed(req, res) {
    try {
      const { category, dateFrom, dateTo } = req.query;
      const result = await FundraisingService.getCompleted(req.user.id, category, dateFrom, dateTo);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const result = await FundraisingService.updateFundraiser(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async complete(req, res) {
    try {
      const result = await FundraisingService.markCompleted(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const result = await FundraisingService.deleteFundraiser(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FundraisingController;