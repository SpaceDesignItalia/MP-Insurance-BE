const express = require("express");
const router = express.Router();
const CompanyGET = require("./companyGET");

const Company = (db) => {
  router.use("/GET", CompanyGET(db)); // Passa il database a CompanyGET
  return router;
};

module.exports = Company;
