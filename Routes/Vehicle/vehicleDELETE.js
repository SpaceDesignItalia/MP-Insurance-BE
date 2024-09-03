// vehicleGET.js
const express = require("express");
const router = express.Router();
const VehicleController = require("../../Controllers/VehicleController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const vehicleDELETE = (db) => {
  // Define your routes here

  router.delete("/DeleteVehicle", authenticateMiddleware, (req, res) => {
    VehicleController.deleteVehicle(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = vehicleDELETE;
