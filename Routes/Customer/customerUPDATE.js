// customerPOST.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../Controllers/CustomerController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const customerUPDATE = (db) => {
  // Definisci le route PUT qui
  router.put("/UpdateCustomerData", authenticateMiddleware, (req, res) => {
    CustomerController.updateCustomerData(req, res, db);
  });

  return router;
};

module.exports = customerUPDATE;
