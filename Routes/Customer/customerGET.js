// customerGET.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../Controllers/CustomerController");
const authenticateMiddleware = require("../../middlewares/Authentication/Authmiddleware");

const customerGET = (db) => {
  router.get("/GetAllCustomers", authenticateMiddleware, (req, res) => {
    CustomerController.getAllCustomers(res, db);
  });

  router.get("/GetCustomerById", authenticateMiddleware, (req, res) => {
    CustomerController.getCustomerById(req, res, db);
  });

  router.get("/SearchCustomer", authenticateMiddleware, (req, res) => {
    CustomerController.searchCustomer(req, res, db);
  });

  return router;
};

module.exports = customerGET;
