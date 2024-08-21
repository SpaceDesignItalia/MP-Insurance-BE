const express = require("express");
const router = express.Router();
const PolicyPOST = require("./policyPOST");
const PolicyGET = require("./policyGET");

const Policy = (db) => {
  router.use("/POST", PolicyPOST(db)); // Passa il database a PolicyPOST\
  router.use("/GET", PolicyGET(db)); // Passa il database a PolicyGET
  return router;
};

module.exports = Policy;
