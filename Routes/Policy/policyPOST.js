// policyPOST.js
const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const policyPOST = (db) => {
  // Define your routes here

  router.post("/AddPolicy", authenticateMiddleware, (req, res) => {
    PolicyController.AddPolicy(req, res, db).then(() => checkPolices());
  });

  router.post("/SuspendPolicy", authenticateMiddleware, (req, res) => {
    PolicyController.suspendPolicy(req, res, db);
  });

  router.post("/ReactivatePolicy", authenticateMiddleware, (req, res) => {
    PolicyController.reactivatePolicy(req, res, db);
  });

  function checkPolices() {
    PolicyController.checkExpiringPolices(db);
    PolicyController.checkExpiredPolices(db);
  }

  function sendMessages() {
    PolicyController.sendMessages(db);
  }

  cron.schedule("27 11 * * *", checkPolices, {
    timezone: "Europe/Rome",
  });

  cron.schedule("0 9 * * *", sendMessages, {
    timezone: "Europe/Rome",
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = policyPOST;
