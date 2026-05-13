const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class SearchFundraisingActivityController {
  static async search(query) {
    return await FundraisingActivityEntity.search(query || {});
  }
}

module.exports = SearchFundraisingActivityController;