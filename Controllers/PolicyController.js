const Policy = require("../Models/PolicyModel");

class PolicyController {
  static async getAllPolicies(req, res, db) {
    try {
      const policies = await Policy.getAllPolicies(db);
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPolicyByVehicleId(req, res, db) {
    try {
      const vehicleId = req.query.vehicleId;
      const policyData = await Policy.getPolicyByVehicleId(db, vehicleId);

      res.status(200).json(policyData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchPolicy(req, res, db) {
    try {
      const searchFilter = req.query;
      const policies = await Policy.searchPolicy(db, searchFilter);

      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async AddPolicy(req, res, db) {
    try {
      const policyData = req.body.policyData;

      const policy = await Policy.AddPolicy(db, policyData);
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

  static async getActivePolicies(req, res, db) {
    try {
      const policies = await Policy.getActivePolicies(db);
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getExpiringPolicies(req, res, db) {
    try {
      const policies = await Policy.getExpiringPolicies(db);
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PolicyController;
