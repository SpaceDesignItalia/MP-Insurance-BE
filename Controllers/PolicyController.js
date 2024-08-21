const Policy = require("../Models/PolicyModel");

class PolicyController {
  static async AddPolicy(req, res, db) {
    const {
      clientId,
      vehicleId,
      companyId,
      startDate,
      endDate,
      duration,
      amount,
      insuranceTypeId,
    } = req.body;
    console.log(req.body);
    try {
      const policy = await Policy.AddPolicy(
        db,
        clientId,
        vehicleId,
        companyId,
        startDate,
        endDate,
        duration,
        amount,
        insuranceTypeId
      );
      res.status(200).json(policy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async GetCalendarExpiration(req, res, db) {
    try {
      const policy = await Policy.GetCalendarExpiration(db);
      console.log(policy);
      res.status(200).json(policy);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PolicyController;
