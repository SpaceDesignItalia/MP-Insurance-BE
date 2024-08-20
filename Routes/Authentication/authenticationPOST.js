// authenticationPOST.js
const express = require("express");
const router = express.Router();
const AuthenticationController = require("../../Controllers/AuthenticationController");

const authenticationPOST = (db) => {
  // Definisci le route POST qui
  router.post("/Login", (req, res) => {
    AuthenticationController.login(req, res, db);
  });

  return router;
};

module.exports = authenticationPOST;
