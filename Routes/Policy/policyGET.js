// policyGET.js
const express = require("express");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");

const policyGET = (db) => {
  // Define your routes here

  router.get("/GetCalendarExpiration", (req, res) => {
    PolicyController.GetCalendarExpiration(req, res, db);
  });
  return router; // Return the router to allow usage by the main app
};

module.exports = policyGET;
