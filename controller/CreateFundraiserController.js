const FundraisingEntity = require('../../entity/FundraisingEntity');

class CreateFundraiserController {
  static async handle(req, res) {
    try {
      const { title, description, target_amount, category_id } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({ error: 'Description is required' });
      }

      if (!target_amount || Number(target_amount) <= 0) {
        return res.status(400).json({ error: 'Target amount must be greater than 0' });
      }

      if (!category_id) {
        return res.status(400).json({ error: 'Category is required' });
      }

      const result = await FundraisingEntity.create(req.body, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: 'Unable to create fundraiser' });
    }
  }
}

module.exports = CreateFundraiserController;