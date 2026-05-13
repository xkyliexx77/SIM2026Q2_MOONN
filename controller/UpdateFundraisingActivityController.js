const FundraisingActivityEntity = require('../entity/FundraisingActivityEntity');

class UpdateFundraisingActivityController {
  static async update(id, fundraiserId, data) {
    return await FundraisingActivityEntity.update(id, fundraiserId, data);
  }
}

module.exports = UpdateFundraisingActivityController;