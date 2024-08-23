// companyGET.js
const express = require("express");
const router = express.Router();
const CompanyController = require("../../Controllers/CompanyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const companyGET = (db) => {
  // Define your routes here

  router.get("/GetAllCompanies", authenticateMiddleware, (req, res) => {
    CompanyController.GetAllCompanies(req, res, db);
  });

  router.get("/GetAllInsuranceTypes", authenticateMiddleware, (req, res) => {
    CompanyController.GetAllInsuranceTypes(req, res, db);
  });
  return router; // Return the router to allow usage by the main app
};

module.exports = companyGET;
