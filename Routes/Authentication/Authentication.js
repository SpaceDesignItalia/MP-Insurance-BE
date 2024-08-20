// authenticationRoutes.js
const express = require("express");
const router = express.Router();
const authenticationGET = require("./authenticationGET");
const authenticationPOST = require("./authenticationPOST");

const Authentication = (db) => {
  router.use("/GET", authenticationGET(db));
  router.use("/POST", authenticationPOST(db));
  return router;
};

module.exports = Authentication;
