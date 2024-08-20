const express = require("express");
const router = express.Router();
const PolicyPOST = require("./policyPOST");

const Policy = (db) => {
  router.use("/POST", PolicyPOST(db)); // Passa il database a PolicyPOST
  return router;
};

module.exports = Policy;
