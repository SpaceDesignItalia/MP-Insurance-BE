// authenticationGET.js
const express = require("express");
const router = express.Router();
const AuthenticationController = require("../../Controllers/AuthenticationController");

const authenticationGET = (db) => {
  // Definisci le route POST qui

  router.get("/CheckSession", (req, res) => {
    AuthenticationController.CheckSession(req, res);
  });
  router.get("/GetSessionData", (req, res) => {
    AuthenticationController.GetSessionData(req, res);
  });

  router.get("/Logout", (req, res) => {
    AuthenticationController.logout(req, res);
  });
  return router; // Ritorna il router per consentire l'utilizzo da parte dell'app principale
};

module.exports = authenticationGET;
