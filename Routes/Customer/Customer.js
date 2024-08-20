// customernRoutes.js
const express = require("express");
const router = express.Router();
const customerPOST = require("./customerPOST");
const customerGET = require("./customerGET");

const Customer = (db) => {
  router.use("/POST", customerPOST(db));
  router.use("/GET", customerGET(db));

  return router;
};

module.exports = Customer;
