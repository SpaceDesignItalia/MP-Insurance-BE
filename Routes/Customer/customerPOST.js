// customerPOST.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../Controllers/CustomerController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const customerPOST = (db) => {
  // Definisci le route POST qui
  router.post("/CreateNewCustomer", authenticateMiddleware, (req, res) => {
    CustomerController.createNewCustomer(req, res, db);
  });

  return router;
};

module.exports = customerPOST;
