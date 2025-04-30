// AccidentDELETE.js
const express = require("express");
const router = express.Router();
const AccidentController = require("../../Controllers/AccidentController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const AccidentDELETE = (db) => {
  // Define your routes here

  router.delete("/DeleteAccident", authenticateMiddleware, (req, res) => {
    AccidentController.deleteAccident(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = AccidentDELETE;
