const express = require("express");
const router = express.Router();
const PolicyController = require("../../Controllers/PolicyController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const policyDELETE = (db) => {
  // Definisci le route DELETE qui
  router.delete("/DeletePolicy", authenticateMiddleware, (req, res) => {
    console.log("DeletePolicy");
    PolicyController.deletePolicy(req, res, db);
  });

  return router;
};

module.exports = policyDELETE;
