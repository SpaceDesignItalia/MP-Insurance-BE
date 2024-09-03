const Vehicle = require("../Models/VehicleModel");

class VehicleController {
  static async GetClientVehicles(req, res, db) {
    try {
      const clientId = req.query.clientId;
      const vehicles = await Vehicle.GetClientVehicles(db, clientId);
      res.status(200).json(vehicles);
    } catch (error) {
      console.error("Errore nel recupero dei veicolo:", error);
      res.status(500).send("Recupero dei veicolo fallito");
    }
  }

  static async GetClientVehiclesUninsured(req, res, db) {
    try {
      const clientId = req.query.clientId;
      const vehicles = await Vehicle.GetClientVehiclesUninsured(db, clientId);
      res.status(200).json(vehicles);
    } catch (error) {
      console.error("Errore nel recupero dei veicolo:", error);
      res.status(500).send("Recupero dei veicolo fallito");
    }
  }

  static async addNewVehicle(req, res, db) {
    try {
      const clientId = req.body.clientId;
      const VehicleData = req.body.vehicleData;

      await Vehicle.addNewVehicle(db, clientId, VehicleData);

      res.status(200).send("Veicolo aggiunto con successo");
    } catch (error) {
      console.error("Errore nell'aggiunta del veicolo:", error);
      res.status(500).send("Aggiunta del veicolo fallito");
    }
  }

  static async getAllVehicles(req, res, db) {
    try {
      const vehicles = await Vehicle.getAllVehicles(db);
      res.status(200).json(vehicles);
    } catch (error) {
      console.error("Error while retrieving vehicles:", error);
      res.status(500).send("Failed to retrieve vehicles");
    }
  }

  static async getVehicleById(req, res, db) {
    try {
      const vehicleId = req.query.vehicleId;
      const vehicle = await Vehicle.getVehicleById(db, vehicleId);
      res.status(200).json(vehicle);
    } catch (error) {
      console.error("Error while retrieving vehicle:", error);
      res.status(500).send("Failed to retrieve vehicle");
    }
  }

  static async updateVehicleData(req, res, db) {
    try {
      const vehicleData = req.body.vehicleData;
      await Vehicle.updateVehicleData(db, vehicleData);
      res.status(200).json({ message: "Veicolo aggiornato con successo" });
    } catch (error) {
      console.error("Errore durante l'aggiornamento del veicolo:", error);
      res.status(500).send("Aggiornamento del veicolo fallito");
    }
  }

  static async deleteVehicle(req, res, db) {
    try {
      const vehicleId = req.query.selectedVehicleId;
      await Vehicle.deleteVehicle(db, vehicleId);
      res.status(200).send("Veicolo cancellato con successo");
    } catch (error) {
      console.error("Errore nella cancellazione del vehicolo:", error);
      res.status(500).send("Eliminazione del veicolo fallito");
    }
  }
}

module.exports = VehicleController;
