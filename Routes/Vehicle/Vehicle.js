const express = require("express");
const router = express.Router();
const VehicleGET = require("./vehicleGET");

const Vehicle = (db) => {
  router.use("/GET", VehicleGET(db)); // Passa il database a VehicleGET
  return router;
};

module.exports = Vehicle;
