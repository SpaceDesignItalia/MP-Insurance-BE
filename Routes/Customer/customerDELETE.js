const express = require("express");
const router = express.Router();
const CustomerController = require("../../Controllers/CustomerController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const customerDELETE = (db) => {
  // Definisci le route DELETE qui
  router.delete("/DeleteCustomer", authenticateMiddleware, (req, res) => {
    CustomerController.deleteCustomer(req, res, db);
  });

  return router;
};

module.exports = customerDELETE;
