// vehicleGET.js
const express = require("express");
const router = express.Router();
const VehicleController = require("../../Controllers/VehicleController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const vehiclePOST = (db) => {
  // Define your routes here

  router.post("/AddNewVehicle", authenticateMiddleware, (req, res) => {
    VehicleController.addNewVehicle(req, res, db);
  });

  return router; // Return the router to allow usage by the main app
};

module.exports = vehiclePOST;
