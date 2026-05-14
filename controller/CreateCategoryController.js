const CategoryEntity = require('../entity/CategoryEntity');

class CreateCategoryController {
  static async create(name, description) {
    return await CategoryEntity.create(name, description);
  }
}

module.exports = CreateCategoryController;