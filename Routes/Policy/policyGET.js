// policyGET.js
const express = require("express");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const policyGET = (db) => {
  // Define your routes here

  router.get("/GetAllPolicies", authenticateMiddleware, (req, res) => {
    PolicyController.getAllPolicies(req, res, db);
  });

  router.get("/GetPolicyByVehicleId", authenticateMiddleware, (req, res) => {
    PolicyController.getPolicyByVehicleId(req, res, db);
  });

  router.get("/SearchPolicy", authenticateMiddleware, (req, res) => {
    PolicyController.searchPolicy(req, res, db);
  });

  router.get("/GetCalendarExpiration", (req, res) => {
    PolicyController.GetCalendarExpiration(req, res, db);
  });
  return router; // Return the router to allow usage by the main app
};

module.exports = policyGET;
