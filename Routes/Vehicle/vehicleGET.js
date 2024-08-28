// vehicleGET.js
const express = require("express");
const router = express.Router();
const VehicleController = require("../../Controllers/VehicleController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const vehicleGET = (db) => {
  // Define your routes here

  router.get("/GetClientVehicles", authenticateMiddleware, (req, res) => {
    VehicleController.GetClientVehicles(req, res, db);
  });

  router.get(
    "/GetClientVehiclesUninsured",
    authenticateMiddleware,
    (req, res) => {
      VehicleController.GetClientVehiclesUninsured(req, res, db);
    }
  );
  return router; // Return the router to allow usage by the main app
};

module.exports = vehicleGET;
