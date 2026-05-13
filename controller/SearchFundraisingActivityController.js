const FundraisingActivityEntity = require('../entity/FundraisingActivityEntity');

class SearchFundraisingActivityController {
  static async search(query) {
    return await FundraisingActivityEntity.search(query || {});
  }
}

module.exports = SearchFundraisingActivityController;