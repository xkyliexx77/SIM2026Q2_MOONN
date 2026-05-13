const FundraisingEntity = require('../../entity/FundraisingEntity');

class ViewAllFundraisersController {
  static async handle(req, res) {
    try {
      const { search, category } = req.query;
      const fundraisers = await FundraisingEntity.getAll(search, category);
      res.json(fundraisers);
    } catch (error) {
      res.status(500).json({ error: 'Unable to load fundraisers' });
    }
  }
}

module.exports = ViewAllFundraisersController;