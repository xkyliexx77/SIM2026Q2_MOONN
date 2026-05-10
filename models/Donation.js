class Donation {
  constructor(id, user_id, fundraiser_id, amount, donated_at) {
    this.id = id;
    this.user_id = user_id;
    this.fundraiser_id = fundraiser_id;
    this.amount = amount;
    this.donated_at = donated_at;
  }
}

module.exports = Donation;