const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class CreateFundraisingActivityController {
  static async create(data, fundraiserId) {
    return await FundraisingActivityEntity.create(data, fundraiserId);
  }
}

module.exports = CreateFundraisingActivityController;