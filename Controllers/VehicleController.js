const Vehicle = require("../Models/VehicleModel");

class VehicleController {
  static async GetClientVehicles(req, res, db) {
    try {
      const vehicles = await Vehicle.GetClientVehicles(db, req.query.clientId);
      res.status(200).json(vehicles);
    } catch (error) {
      console.error("Error while retrieving vehicles:", error);
      res.status(500).send("Failed to retrieve vehicles");
    }
  }
}

module.exports = VehicleController;
