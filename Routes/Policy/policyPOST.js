// policyPOST.js
const express = require("express");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const policyPOST = (db) => {
  // Define your routes here

  router.post("/AddPolicy", authenticateMiddleware, (req, res) => {
    PolicyController.AddPolicy(req, res, db);
  });
  return router; // Return the router to allow usage by the main app
};

module.exports = policyPOST;
