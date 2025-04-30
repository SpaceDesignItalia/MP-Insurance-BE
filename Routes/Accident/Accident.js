const express = require("express");
const router = express.Router();
const AccidentGET = require("./AccidentGET");
const AccidentPOST = require("./AccidentPOST");
const AccidentDELETE = require("./AccidentDELETE");
const AccidentUPDATE = require("./AccidentUPDATE");

const Accident = (db) => {
  router.use("/GET", AccidentGET(db)); // Passa il database a AccidentGET
  router.use("/POST", AccidentPOST(db)); // Passa il database a AccidentPOST
  router.use("/UPDATE", AccidentUPDATE(db)); // Passa il database a AccidentUPDATE
  router.use("/DELETE", AccidentDELETE(db)); // Passa il database a AccidentDELETE
  return router;
};

module.exports = Accident;
