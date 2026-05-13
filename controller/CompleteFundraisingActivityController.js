const FundraisingActivityEntity = require('../entity/FundraisingActivityEntity');

class CompleteFundraisingActivityController {
  static async complete(id, fundraiserId) {
    return await FundraisingActivityEntity.complete(id, fundraiserId);
  }
}

module.exports = CompleteFundraisingActivityController;