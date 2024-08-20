const Company = require("../Models/CompanyModel");

class CompanyController {
  static async GetAllCompanies(req, res, db) {
    try {
      const companys = await Company.GetAllCompanies(db);
      res.status(200).json(companys);
    } catch (error) {
      console.error("Error while retrieving companys:", error);
      res.status(500).send("Failed to retrieve companys");
    }
  }

  static async GetAllInsuranceTypes(req, res, db) {
    try {
      const insuranceTypes = await Company.GetAllInsuranceTypes(db);
      res.status(200).json(insuranceTypes);
    } catch (error) {
      console.error("Error while retrieving insurance types:", error);
      res.status(500).send("Failed to retrieve insurance types");
    }
  }
}

module.exports = CompanyController;
