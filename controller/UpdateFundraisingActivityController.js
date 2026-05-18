const FundraisingActivityEntity =
  require('../entity/FundraisingEntity');

class UpdateFundraisingActivityController {

  static async update(
    fundraiserId,
    userId,
    fundraiserData
  ) {

    const {
      title,
      description,
      target_amount,
      category_id
    } = fundraiserData;

    return await FundraisingActivityEntity.update(
      fundraiserId,
      userId,
      title,
      description,
      target_amount,
      category_id
    );

  }

}

module.exports =
  UpdateFundraisingActivityController;