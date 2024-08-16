// authenticationRoutes.js
const express = require("express");
const router = express.Router();
const authenticationGET = require("./authenticationGET");
const authenticationPOST = require("./authenticationPOST");

const Authentication = (db) => {
  router.use("/GET", authenticationGET(db)); // Passa il database a stafferGET
  router.use("/POST", authenticationPOST(db)); // Passa il database a stafferPOST
  return router;
};

module.exports = Authentication;
