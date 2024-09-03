const express = require("express");
const router = express.Router();
const VehicleGET = require("./vehicleGET");
const vehiclePOST = require("./vehiclePOST");
const vehicleDELETE = require("./vehicleDELETE");

const Vehicle = (db) => {
  router.use("/GET", VehicleGET(db)); // Passa il database a VehicleGET
  router.use("/POST", vehiclePOST(db)); // Passa il database a VehiclePOST
  router.use("/DELETE", vehicleDELETE(db)); // Passa il database a VehicleDELETE)
  return router;
};

module.exports = Vehicle;
