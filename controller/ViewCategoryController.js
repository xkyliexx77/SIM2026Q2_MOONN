const CategoryEntity = require('../entity/CategoryEntity');

class ViewCategoryController {
  static async viewAll() {
    return await CategoryEntity.viewAll();
  }
}

module.exports = ViewCategoryController;