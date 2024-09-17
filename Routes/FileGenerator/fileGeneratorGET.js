// fileGeneratorPOST.js
const express = require("express");
const router = express.Router();
const FileGeneratorController = require("../../Controllers/FileGeneratorController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const fileGeneratorGET = (db) => {
  // Define your routes here

  router.get("/GetMonthPolicyExcel", authenticateMiddleware, (req, res) => {
    FileGeneratorController.getMonthPolicyExcel(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = fileGeneratorGET;
