const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class DeleteFundraisingActivityController {
  static async delete(id, fundraiserId) {
    return await FundraisingActivityEntity.delete(id, fundraiserId);
  }
}

module.exports = DeleteFundraisingActivityController;