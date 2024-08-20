// controller/PermissionController.js
const Customer = require("../Models/CustomerModel");

class CustomerController {
  static async createNewCustomer(req, res, db) {
    try {
      const CustomerData = req.body.CustomerData;
      const VehicleData = req.body.VehicleData;

      const newCustomerId = await Customer.createNewCustomer(db, CustomerData);
      if (newCustomerId) {
        Customer.createNewVehicle(db, VehicleData, newCustomerId);
      }
      res.status(200).json({
        message: "Cliente registrato con successo",
      });
    } catch (error) {
      console.error("Errore nella creazione del cliente:", error);
      res.status(500).send("Creazione del cliente fallito");
    }
  }
}

module.exports = CustomerController;
