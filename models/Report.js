class Report {
  constructor(type, totalDonations, totalAmount, totalFundraisers, generatedAt) {
    this.type = type;
    this.totalDonations = totalDonations;
    this.totalAmount = totalAmount;
    this.totalFundraisers = totalFundraisers;
    this.generatedAt = generatedAt;
  }
}

module.exports = Report;