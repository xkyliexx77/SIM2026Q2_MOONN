const CategoryEntity = require('../entity/CategoryEntity');

class SearchCategoryController {
  static async search(searchText) {
    return await CategoryEntity.search(searchText || '');
  }
}

module.exports = SearchCategoryController;