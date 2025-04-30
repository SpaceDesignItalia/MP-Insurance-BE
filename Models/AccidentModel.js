class AccidentModel {
  static getAllAccidents(db) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT i.*, p."policyId", 
               i."weather_condition", 
               i."road_condition",
               s."estimatedAmount", s."settledAmount", s.deductible, s."responsibilityPercentage"
        FROM public."Incidents" i
        LEFT JOIN public.policy p ON i."id_polizza" = p."policyId"
        LEFT JOIN public."Settlements" s ON i."id_incidente" = s."incidentId"
        ORDER BY i."data_incidente" DESC`;

      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAccidentById(db, accidentId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT i.*, p."policyId", 
               i."weather_condition", 
               i."road_condition",
               s."estimatedAmount", s."settledAmount", s.deductible, s."responsibilityPercentage"
        FROM public."Incidents" i
        LEFT JOIN public.policy p ON i."id_polizza" = p."policyId"
        LEFT JOIN public."Settlements" s ON i."id_incidente" = s."incidentId"
        WHERE i."id_incidente" = $1`;

      db.query(query, [accidentId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]);
        }
      });
    });
  }

  static getClientAccidents(db, clientId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT i.*, p."policyId", 
               i."weather_condition", 
               i."road_condition",
               s."estimatedAmount", s."settledAmount", s.deductible, s."responsibilityPercentage"
        FROM public."Incidents" i
        LEFT JOIN public.policy p ON i."id_polizza" = p."policyId"
        LEFT JOIN public."Settlements" s ON i."id_incidente" = s."incidentId"
        WHERE p."clientId" = $1
        ORDER BY i."data_incidente" DESC`;

      db.query(query, [clientId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static addNewAccident(db, accidentData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Inizia la transazione
        await db.query("BEGIN");

        // 1. Inserisci il record principale dell'incidente
        const incidentQuery = `
          INSERT INTO public."Incidents"(
            "data_incidente", "ora_incidente", "luogo_incidente", "descrizione", "stato", 
            "weather_condition", "road_condition", "id_polizza")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING "id_incidente"`;

        const incidentValues = [
          accidentData.date,
          accidentData.time,
          accidentData.location,
          accidentData.description,
          "Aperto", // Status iniziale
          accidentData.weatherCondition || null,
          accidentData.roadCondition || null,
          accidentData.policyId,
        ];

        const incidentResult = await db.query(incidentQuery, incidentValues);
        const incidentId = incidentResult.rows[0].id_incidente;

        // 2. Inserisci il record della liquidazione se i dati sono disponibili
        if (
          accidentData.estimatedAmount ||
          accidentData.deductible ||
          accidentData.responsibilityPercentage
        ) {
          const settlementQuery = `
            INSERT INTO public."Settlements"(
              "incidentId", "estimatedAmount", deductible, "responsibilityPercentage", "settlementDate")
            VALUES ($1, $2, $3, $4, CURRENT_DATE)`;

          const settlementValues = [
            incidentId,
            accidentData.estimatedAmount || 0,
            accidentData.deductible || 0,
            accidentData.responsibilityPercentage || 0,
          ];

          await db.query(settlementQuery, settlementValues);
        }

        // Conferma la transazione
        await db.query("COMMIT");

        resolve(incidentId);
      } catch (error) {
        // Annulla la transazione in caso di errore
        await db.query("ROLLBACK");
        reject(error);
      }
    });
  }

  static updateAccidentData(db, accidentData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Inizia la transazione
        await db.query("BEGIN");

        // 1. Aggiorna i dati dell'incidente
        const incidentQuery = `
          UPDATE public."Incidents" 
          SET "data_incidente" = $1, 
              "ora_incidente" = $2, 
              "luogo_incidente" = $3, 
              "descrizione" = $4, 
              "stato" = $5,
              "weather_condition" = $6, 
              "road_condition" = $7, 
              "id_polizza" = $8
          WHERE "id_incidente" = $9`;

        const incidentValues = [
          accidentData.date,
          accidentData.time,
          accidentData.location,
          accidentData.description,
          accidentData.status,
          accidentData.weatherCondition || null,
          accidentData.roadCondition || null,
          accidentData.policyId,
          accidentData.id,
        ];

        await db.query(incidentQuery, incidentValues);

        // 2. Aggiorna o inserisci la liquidazione
        const checkSettlementExists = await db.query(
          `SELECT "settlementId" FROM public."Settlements" WHERE "incidentId" = $1`,
          [accidentData.id]
        );

        if (checkSettlementExists.rows.length > 0) {
          // Aggiorna la liquidazione esistente
          const updateSettlementQuery = `
            UPDATE public."Settlements"
            SET "estimatedAmount" = $1, 
                "settledAmount" = $2, 
                deductible = $3, 
                "responsibilityPercentage" = $4
            WHERE "incidentId" = $5`;

          const updateSettlementValues = [
            accidentData.estimatedAmount || 0,
            accidentData.paidAmount || null,
            accidentData.deductible || 0,
            accidentData.responsibilityPercentage || 0,
            accidentData.id,
          ];

          await db.query(updateSettlementQuery, updateSettlementValues);
        } else {
          // Inserisci una nuova liquidazione
          const newSettlementQuery = `
            INSERT INTO public."Settlements"(
              "incidentId", "estimatedAmount", "settledAmount", deductible, "responsibilityPercentage", "settlementDate")
            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)`;

          const newSettlementValues = [
            accidentData.id,
            accidentData.estimatedAmount || 0,
            accidentData.paidAmount || null,
            accidentData.deductible || 0,
            accidentData.responsibilityPercentage || 0,
          ];

          await db.query(newSettlementQuery, newSettlementValues);
        }

        // Conferma la transazione
        await db.query("COMMIT");

        resolve(true);
      } catch (error) {
        // Annulla la transazione in caso di errore
        await db.query("ROLLBACK");
        reject(error);
      }
    });
  }

  static deleteAccident(db, accidentId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Inizia la transazione
        await db.query("BEGIN");

        // 1. Elimina i record collegati nella tabella Settlements
        await db.query(
          `DELETE FROM public."Settlements" WHERE "incidentId" = $1`,
          [accidentId]
        );

        // 2. Elimina i record collegati nella tabella IncidentParticipants
        await db.query(
          `DELETE FROM public."IncidentParticipants" WHERE "incidentId" = $1`,
          [accidentId]
        );

        // 3. Elimina i record collegati nella tabella IncidentWitnesses
        await db.query(
          `DELETE FROM public."IncidentWitnesses" WHERE "incidentId" = $1`,
          [accidentId]
        );

        // 4. Elimina i record collegati nella tabella Documents
        await db.query(
          `DELETE FROM public."Documents" WHERE "incidentId" = $1`,
          [accidentId]
        );

        // 5. Elimina l'incidente
        await db.query(
          `DELETE FROM public."Incidents" WHERE "id_incidente" = $1`,
          [accidentId]
        );

        // Conferma la transazione
        await db.query("COMMIT");

        resolve(true);
      } catch (error) {
        // Annulla la transazione in caso di errore
        await db.query("ROLLBACK");
        reject(error);
      }
    });
  }
}

module.exports = AccidentModel;
