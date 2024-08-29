// customernRoutes.js
const express = require("express");
const router = express.Router();
const customerPOST = require("./customerPOST");
const customerGET = require("./customerGET");
const customerUPDATE = require("./customerUPDATE");

const Customer = (db) => {
  router.use("/POST", customerPOST(db));
  router.use("/GET", customerGET(db));
  router.use("/UPDATE", customerUPDATE(db));

  return router;
};

module.exports = Customer;
