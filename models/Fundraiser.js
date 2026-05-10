class Fundraiser {
  constructor(id, title, description, target_amount, current_amount, category_id, fundraiser_id, status, created_at, views, favourite_count) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.target_amount = target_amount;
    this.current_amount = current_amount;
    this.category_id = category_id;
    this.fundraiser_id = fundraiser_id;
    this.status = status;
    this.created_at = created_at;
    this.views = views;
    this.favourite_count = favourite_count;
  }
}

module.exports = Fundraiser;