// authenticationPOST.js
const express = require("express");
const router = express.Router();
const AuthenticationController = require("../../Controllers/AuthenticationController");

const authenticationPOST = (db) => {
  // Definisci le route POST qui
  router.post("/Login", (req, res) => {
    AuthenticationController.login(req, res, db);
  });

  router.post("/RequestPasswordReset", (req, res) => {
    AuthenticationController.requestPasswordReset(req, res, db);
  });

  router.post("/VerifyOTP", (req, res) => {
    AuthenticationController.verifyOTP(req, res, db);
  });

  router.post("/ResetPassword", (req, res) => {
    AuthenticationController.resetPassword(req, res, db);
  });

  return router;
};

module.exports = authenticationPOST;
