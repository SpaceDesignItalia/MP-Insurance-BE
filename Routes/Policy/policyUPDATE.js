// policyPOST.js
const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const policyUPDATE = (db) => {
  // Define your routes here

  router.put(
    "/ChangePolicyPaymentStatus",
    authenticateMiddleware,
    (req, res) => {
      PolicyController.changePolicyPaymentStatus(req, res, db);
    }
  );

  router.put("/UpdateNote", authenticateMiddleware, (req, res) => {
    PolicyController.updateNote(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = policyUPDATE;
