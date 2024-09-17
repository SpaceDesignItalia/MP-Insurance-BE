const express = require("express");
const router = express.Router();
const fileGeneratorGET = require("./fileGeneratorGET");

const Policy = (db) => {
  router.use("/GET", fileGeneratorGET(db)); // Passa il database a PolicyPOST
  return router;
};

module.exports = Policy;
