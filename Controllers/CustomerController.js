// controller/PermissionController.js
const Customer = require("../Models/CustomerModel");

class CustomerController {
  static async getAllCustomers(res, db) {
    try {
      const customers = await Customer.getAllCustomers(db);

      res.status(200).json(customers);
    } catch (error) {
      console.error("Errore nel recupero dei clienti:", error);
      res.status(500).send("Recupero dei clienti fallito");
    }
  }

  static async getCustomerById(req, res, db) {
    try {
      const clientId = req.query.clientId;
      const customer = await Customer.getCustomerById(db, clientId);

      res.status(200).json(customer);
    } catch (error) {
      console.error("Errore nel recupero del cliente:", error);
      res.status(500).send("Recupero del cliente fallito");
    }
  }

  static async searchCustomer(req, res, db) {
    try {
      const searchTerm = req.query.searchTerm;

      const customers = await Customer.searchCustomer(db, searchTerm);

      res.status(200).json(customers);
    } catch (error) {
      console.error("Errore nel recupero dei clienti:", error);
      res.status(500).send("Recupero dei clienti fallito");
    }
  }

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

  static async updateCustomerData(req, res, db) {
    try {
      const CustomerData = req.body.customerData;

      await Customer.updateCustomerData(db, CustomerData);

      res.status(200).json({
        message: "Dati del cliente aggiornato con successo",
      });
    } catch (error) {
      console.error("Errore nella creazione del cliente:", error);
      res.status(500).send("Creazione del cliente fallito");
    }
  }

  static async deleteCustomer(req, res, db) {
    try {
      const customerId = req.query.clientId;

      await Customer.deleteCustomer(db, customerId);

      res.status(200).json({
        message: "Cliente eliminato con successo",
      });
    } catch (error) {
      console.error("Errore nell'eliminazione del cliente:", error);
      res.status(500).send("Eliminazione del cliente fallito");
    }
  }
}

module.exports = CustomerController;
