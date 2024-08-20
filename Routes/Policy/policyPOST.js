// policyPOST.js
const express = require("express");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");

const policyPOST = (db) => {
  // Define your routes here

  router.post("/AddPolicy", (req, res) => {
    PolicyController.AddPolicy(req, res, db);
  });
  return router; // Return the router to allow usage by the main app
};

module.exports = policyPOST;
