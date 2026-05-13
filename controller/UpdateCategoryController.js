const CategoryEntity = require('../entity/CategoryEntity');

class UpdateCategoryController {
  static async update(id, data) {
    return await CategoryEntity.update(id, data);
  }
}

module.exports = UpdateCategoryController;