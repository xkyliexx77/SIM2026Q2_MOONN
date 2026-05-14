const FundraisingEntity = require('../entity/FundraisingEntity');

class SearchFundraisingActivityController {

  static async searchFundraisingActivities(
    searchText,
    categoryId
  ) {

    return await FundraisingEntity.searchFundraisingActivities(
      searchText,
      categoryId
    );

  }

}

module.exports = SearchFundraisingActivityController;