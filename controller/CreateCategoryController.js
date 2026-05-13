const CategoryEntity = require('../entity/CategoryEntity');

class CreateCategoryController {
  static async create(data) {
    return await CategoryEntity.create(data);
  }
}

module.exports = CreateCategoryController;