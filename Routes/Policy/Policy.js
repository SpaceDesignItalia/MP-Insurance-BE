const express = require("express");
const router = express.Router();
const policyPOST = require("./policyPOST");
const policyGET = require("./policyGET");

const Policy = (db) => {
  router.use("/POST", policyPOST(db)); // Passa il database a PolicyPOST
  router.use("/GET", policyGET(db)); // Passa il database a PolicyGET
  return router;
};

module.exports = Policy;
