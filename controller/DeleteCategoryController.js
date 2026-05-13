const CategoryEntity = require('../entity/CategoryEntity');

class DeleteCategoryController {
  static async delete(id) {
    return await CategoryEntity.delete(id);
  }
}

module.exports = DeleteCategoryController;