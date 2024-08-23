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

  static async searchPolicy(req, res, db) {
    try {
      const searchTerms = req.param.searchTerms;
      const policies = await Policy.searchPolicy(db, searchTerms);
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
}

module.exports = PolicyController;
