const CategoryEntity = require('../entity/CategoryEntity');

class UpdateCategoryController {
  static async update(id, name, description) {
    return await CategoryEntity.update(id, name, description);
  }
}

module.exports = UpdateCategoryController;