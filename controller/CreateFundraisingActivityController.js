const FundraisingActivityEntity = require('../entity/FundraisingEntity');

class CreateFundraisingActivityController {

  static async create(
    title,
    description,
    target_amount,
    category_id,
    fundraiserId
  ) {

    return await FundraisingActivityEntity.create(
      title,
      description,
      target_amount,
      category_id,
      fundraiserId
    );

  }

}

module.exports =
  CreateFundraisingActivityController;