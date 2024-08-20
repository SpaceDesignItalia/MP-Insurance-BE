// controller/PermissionController.js
const Client = require("../Models/ClientModel");

class ClientController {
  static async GetAllClients(req, res, db) {
    try {
      const clients = await Client.GetAllClients(db);
      res.status(200).json(clients);
    } catch (error) {
      console.error("Errore nel recupero dei clienti:", error);
      res.status(500).send("Recupero dei clienti fallito");
    }
  }
}
module.exports = ClientController;
