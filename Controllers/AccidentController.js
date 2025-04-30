const Accident = require("../Models/AccidentModel");

class AccidentController {
  static async getAllAccidents(req, res, db) {
    try {
      const accidents = await Accident.getAllAccidents(db);
      res.status(200).json(accidents);
    } catch (error) {
      console.error("Errore nel recupero degli incidenti:", error);
      res.status(500).send("Recupero degli incidenti fallito");
    }
  }

  static async getAccidentById(req, res, db) {
    try {
      const accidentId = req.query.accidentId;
      const accident = await Accident.getAccidentById(db, accidentId);

      if (!accident) {
        return res.status(404).json({ message: "Incidente non trovato" });
      }

      res.status(200).json(accident);
    } catch (error) {
      console.error("Errore nel recupero dell'incidente:", error);
      res.status(500).send("Recupero dell'incidente fallito");
    }
  }

  static async getClientAccidents(req, res, db) {
    try {
      const clientId = req.query.clientId;
      const accidents = await Accident.getClientAccidents(db, clientId);
      res.status(200).json(accidents);
    } catch (error) {
      console.error("Errore nel recupero degli incidenti del cliente:", error);
      res.status(500).send("Recupero degli incidenti del cliente fallito");
    }
  }

  static async addNewAccident(req, res, db) {
    try {
      const accidentData = req.body;
      const incidentId = await Accident.addNewAccident(db, accidentData);
      res.status(201).json({
        message: "Incidente creato con successo",
        incidentId,
      });
    } catch (error) {
      console.error("Errore nella creazione dell'incidente:", error);
      res.status(500).send("Creazione dell'incidente fallita");
    }
  }

  static async updateAccidentData(req, res, db) {
    try {
      const accidentData = req.body;

      // Verifica se l'incidente esiste
      const accident = await Accident.getAccidentById(db, accidentData.id);
      if (!accident) {
        return res.status(404).json({ message: "Incidente non trovato" });
      }

      await Accident.updateAccidentData(db, accidentData);
      res.status(200).json({ message: "Incidente aggiornato con successo" });
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'incidente:", error);
      res.status(500).send("Aggiornamento dell'incidente fallito");
    }
  }

  static async deleteAccident(req, res, db) {
    try {
      const accidentId = req.query.accidentId;

      // Verifica se l'incidente esiste
      const accident = await Accident.getAccidentById(db, accidentId);
      if (!accident) {
        return res.status(404).json({ message: "Incidente non trovato" });
      }

      await Accident.deleteAccident(db, accidentId);
      res.status(200).json({ message: "Incidente eliminato con successo" });
    } catch (error) {
      console.error("Errore nell'eliminazione dell'incidente:", error);
      res.status(500).send("Eliminazione dell'incidente fallita");
    }
  }

  // Endpoint per la gestione di CreateAccident come nella forma frontend
  static async createAccident(req, res, db) {
    try {
      const accidentData = req.body;

      // Validazione dei campi obbligatori
      const requiredFields = [
        "date",
        "time",
        "location",
        "description",
        "policyId",
      ];
      for (const field of requiredFields) {
        if (!accidentData[field]) {
          return res
            .status(400)
            .json({ message: `Campo obbligatorio mancante: ${field}` });
        }
      }

      const incidentId = await Accident.addNewAccident(db, accidentData);
      res.status(201).json({
        message: "Incidente creato con successo",
        incidentId,
      });
    } catch (error) {
      console.error("Errore nella creazione dell'incidente:", error);
      res.status(500).send("Creazione dell'incidente fallita");
    }
  }
}

module.exports = AccidentController;
