// customernRoutes.js
const express = require("express");
const router = express.Router();
const customerPOST = require("./customerPOST");

const Customer = (db) => {
  router.use("/POST", customerPOST(db));
  return router;
};

module.exports = Customer;
