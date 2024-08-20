// clientGET.js
const express = require("express");
const router = express.Router();
const ClientController = require("../../Controllers/ClientController");

const clientGET = (db) => {
  // Definisci le route POST qui

  router.get("/GetAllClients", (req, res) => {
    ClientController.GetAllClients(req, res, db);
  });
  return router; // Ritorna il router per consentire l'utilizzo da parte dell'app principale
};

module.exports = clientGET;
