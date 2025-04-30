// AccidentUPDATE.js
const express = require("express");
const router = express.Router();
const AccidentController = require("../../Controllers/AccidentController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const AccidentUPDATE = (db) => {
  // Define your routes here

  router.put("/UpdateAccidentData", authenticateMiddleware, (req, res) => {
    AccidentController.updateAccidentData(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = AccidentUPDATE;
