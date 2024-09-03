// vehicleGET.js
const express = require("express");
const router = express.Router();
const VehicleController = require("../../Controllers/VehicleController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const vehicleUPDATE = (db) => {
  // Define your routes here

  router.put("/UpdateVehicleData", authenticateMiddleware, (req, res) => {
    VehicleController.updateVehicleData(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = vehicleUPDATE;
