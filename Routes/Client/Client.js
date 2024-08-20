// clientRoutes.js
const express = require("express");
const router = express.Router();
const clientGET = require("./clientGET");

const Client = (db) => {
  router.use("/GET", clientGET(db)); // Passa il database a stafferGET
  return router;
};

module.exports = Client;
