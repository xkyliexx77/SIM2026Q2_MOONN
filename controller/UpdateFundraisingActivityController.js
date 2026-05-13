const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class UpdateFundraisingActivityController {
  static async update(id, fundraiserId, data) {
    return await FundraisingActivityEntity.update(id, fundraiserId, data);
  }
}

module.exports = UpdateFundraisingActivityController;