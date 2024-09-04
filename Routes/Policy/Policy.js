const express = require("express");
const router = express.Router();
const policyPOST = require("./policyPOST");
const policyGET = require("./policyGET");
const policyUPDATE = require("./policyUPDATE");
const policyDELETE = require("./policyDELETE");

const Policy = (db) => {
  router.use("/POST", policyPOST(db)); // Passa il database a PolicyPOST
  router.use("/GET", policyGET(db)); // Passa il database a PolicyGET
  router.use("/UPDATE", policyUPDATE(db)); // Passa il database a PolicyUPDATE
  router.use("/DELETE", policyDELETE(db)); // Passa il database a PolicyDELETE
  return router;
};

module.exports = Policy;
