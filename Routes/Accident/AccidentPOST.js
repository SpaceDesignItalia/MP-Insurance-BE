// AccidentPOST.js
const express = require("express");
const router = express.Router();
const AccidentController = require("../../Controllers/AccidentController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const AccidentPOST = (db) => {
  // Define your routes here

  router.post("/AddNewAccident", authenticateMiddleware, (req, res) => {
    AccidentController.addNewAccident(req, res, db);
  });

  router.post("/CreateAccident", authenticateMiddleware, (req, res) => {
    AccidentController.createAccident(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = AccidentPOST;
