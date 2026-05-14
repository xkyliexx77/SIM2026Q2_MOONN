const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class UpdateFundraisingActivityController {
  static async update(id, fundraiserId, title, description, target_amount, category_id) {
    return await FundraisingActivityEntity.update(
      id,
      fundraiserId,
      title,
      description,
      target_amount,
      category_id
    );
  }
}

module.exports = UpdateFundraisingActivityController;