const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class ViewFundraisingActivityController {
  static async viewOne(id) {
    return await FundraisingActivityEntity.viewOne(id);
  }

  static async viewMine(fundraiserId) {
    return await FundraisingActivityEntity.viewMine(fundraiserId);
  }
}

module.exports = ViewFundraisingActivityController;