// AccidentGET.js
const express = require("express");
const router = express.Router();
const AccidentController = require("../../Controllers/AccidentController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const AccidentGET = (db) => {
  // Define your routes here

  router.get("/GetAllAccidents", authenticateMiddleware, (req, res) => {
    AccidentController.getAllAccidents(req, res, db);
  });

  router.get("/GetAccidentById", authenticateMiddleware, (req, res) => {
    AccidentController.getAccidentById(req, res, db);
  });

  router.get("/GetClientAccidents", authenticateMiddleware, (req, res) => {
    AccidentController.getClientAccidents(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = AccidentGET;
