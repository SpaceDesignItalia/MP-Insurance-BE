const Messages = require("../middlewares/WhatsappBusiness/Messages");

class PolicyModel {
  static async getAllPolicies(db) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT "policyId", CONCAT("firstName", ' ', "lastName") AS "fullName", "email", "typeId", "duration", 
        "amount", "startDate", "endDate", "licensePlate", "status", "paymentStatus", "note"
        FROM public."policy" 
        INNER JOIN public."client" USING("clientId")
        INNER JOIN public."vehicle" USING("vehicleId")
        INNER JOIN public."policyStatus" USING("statusId")
        INNER JOIN public."policyPaymentStatus" USING("paymentStatusId")
        INNER JOIN public."insuranceCompany" USING("companyId")
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        const policies = results.rows;
        const policyPromises = policies.map((policy) => {
          return new Promise((resolve, reject) => {
            const query = `
              SELECT "policyId", "name" 
              FROM public."policyTypes"
              INNER JOIN public."insuranceType" USING("insuranceTypeId")
              WHERE "policyId" = $1
            `;
            db.query(query, [policy.policyId], (error, results) => {
              if (error) {
                return reject(error);
              }
              // Add the list of types to the policy
              policy.types = results.rows.map((row) => row.name);
              resolve(policy);
            });
          });
        });

        // Wait for all policyPromises to resolve
        Promise.all(policyPromises)
          .then((policiesWithTypes) => resolve(policiesWithTypes))
          .catch((error) => reject(error));
      });
    });
  }

  static getPolicyByVehicleId(db, vehicleId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT "policyId", CONCAT("firstName", ' ', "lastName") AS "fullName", "email", "typeId", "duration", 
        "amount", "startDate", "endDate","brand", "model", "licensePlate", "status", "paymentStatus", "companyName", "companyLogo", "note", "startSuspensionDate"
        FROM public."policy" 
        INNER JOIN public."client" USING("clientId")
        INNER JOIN public."vehicle" USING("vehicleId")
        INNER JOIN public."policyStatus" USING("statusId")
        INNER JOIN public."policyPaymentStatus" USING("paymentStatusId")
        INNER JOIN public."insuranceCompany" USING("companyId")
        LEFT JOIN public."suspendedPolicy" USING("policyId")
        WHERE "vehicleId" = $1
      `;

      db.query(query, [vehicleId], (error, results) => {
        if (error) {
          return reject(error);
        }

        const policy = results.rows[0];
        const policyPromise = new Promise((resolve, reject) => {
          const query = `
            SELECT "policyId", "name" 
            FROM public."policyTypes"
            INNER JOIN public."insuranceType" USING("insuranceTypeId")
            WHERE "policyId" = $1
          `;

          db.query(query, [policy.policyId], (error, results) => {
            if (error) {
              return reject(error);
            }
            // Aggiunge l'elenco dei tipi alla `policy`
            policy.types = results.rows.map((row) => row.name);
            resolve(policy);
          });
        });

        // Wait for all policyPromises to resolve
        policyPromise
          .then((policyWithTypes) => {
            // Fai qualcosa con la `policy` che ora include i `types`
            resolve(policyWithTypes);
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }

  static searchPolicy(db, searchFilter) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT "policyId", CONCAT("firstName", ' ', "lastName") AS "fullName", "email", "typeId", "duration", 
        "amount", "startDate", "endDate", "licensePlate", "status", "paymentStatus", "note"
        FROM public."policy" 
        INNER JOIN public."client" USING("clientId")
        INNER JOIN public."vehicle" USING("vehicleId")
        INNER JOIN public."policyStatus" USING("statusId")
        INNER JOIN public."policyPaymentStatus" USING("paymentStatusId")
        INNER JOIN public."insuranceCompany" USING("companyId")
        WHERE 1=1
      `;

      if (searchFilter.searchTerms !== "") {
        query += ` AND CONCAT("firstName", ' ', "lastName") ILIKE '%${searchFilter.searchTerms}%' OR "licensePlate" ILIKE '%${searchFilter.searchTerms}%'`;
      }

      if (
        searchFilter.vehicleTypeId !== "" &&
        searchFilter.vehicleTypeId !== "0"
      ) {
        query += ` AND "typeId" = ${searchFilter.vehicleTypeId}`;
      }

      if (
        searchFilter.policyTypeId !== "" &&
        searchFilter.policyTypeId !== "0"
      ) {
        query += ` AND "policyId" IN (SELECT "policyId" FROM public."policyTypes" WHERE "insuranceTypeId" = ${searchFilter.policyTypeId})`;
      }

      if (searchFilter.duration !== "" && searchFilter.duration !== "0") {
        query += ` AND "duration" = ${searchFilter.duration}`;
      }

      if (searchFilter.state !== "" && searchFilter.state !== "0") {
        query += ` AND "statusId" = ${searchFilter.state}`;
      }

      if (
        searchFilter.paymentStatus !== "" &&
        searchFilter.paymentStatus !== "0"
      ) {
        query += ` AND "paymentStatusId" = ${searchFilter.paymentStatus}`;
      }

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        const policies = results.rows;
        const policyPromises = policies.map((policy) => {
          return new Promise((resolve, reject) => {
            const query = `
              SELECT "policyId", "name" 
              FROM public."policyTypes"
              INNER JOIN public."insuranceType" USING("insuranceTypeId")
              WHERE "policyId" = $1
            `;
            db.query(query, [policy.policyId], (error, results) => {
              if (error) {
                return reject(error);
              }
              // Add the list of types to the policy
              policy.types = results.rows.map((row) => row.name);
              resolve(policy);
            });
          });
        });

        // Wait for all policyPromises to resolve
        Promise.all(policyPromises)
          .then((policiesWithTypes) => resolve(policiesWithTypes))
          .catch((error) => reject(error));
      });
    });
  }

  static AddPolicy(db, policyData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO public."policy" ("vehicleId", "companyId", "startDate", "endDate", 
      "duration", "amount", "clientId", "note") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING "policyId"`;

      db.query(
        query,
        [
          policyData.vehicleId,
          policyData.companyId,
          policyData.startDate,
          policyData.endDate,
          policyData.duration,
          policyData.amount,
          policyData.clientId,
          policyData.note,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
            return reject(error);
          }

          const policyId = results.rows[0]["policyId"];

          const query = `INSERT INTO public."policyTypes" ("policyId", "insuranceTypeId") VALUES ($1, $2)`;

          const promises = [];

          policyData.insuranceTypeIds.forEach((type) => {
            promises.push(
              new Promise((resolve, reject) => {
                db.query(query, [policyId, type], (error, results) => {
                  if (error) {
                    console.log(error);
                    return reject(error);
                  }
                  resolve(results);
                });
              })
            );
          });

          Promise.all(promises)
            .then(() => {
              resolve({ policyId });
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  }

  static GetCalendarExpiration(db) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT "policyId", CONCAT("firstName", ' ', "lastName") AS "fullName", "email", "typeId", "duration", 
        "amount", "startDate", "endDate", "licensePlate", "status", "paymentStatus"
        FROM public."policy" 
        INNER JOIN public."client" USING("clientId")
        INNER JOIN public."vehicle" USING("vehicleId")
        INNER JOIN public."policyStatus" USING("statusId")
        INNER JOIN public."policyPaymentStatus" USING("paymentStatusId")
        INNER JOIN public."insuranceCompany" USING("companyId")
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        const policies = results.rows;
        const policyPromises = policies.map((policy) => {
          return new Promise((resolve, reject) => {
            const query = `
              SELECT "policyId", "name" 
              FROM public."policyTypes"
              INNER JOIN public."insuranceType" USING("insuranceTypeId")
              WHERE "policyId" = $1
            `;
            db.query(query, [policy.policyId], (error, results) => {
              if (error) {
                return reject(error);
              }
              // Add the list of types to the policy
              policy.types = results.rows.map((row) => row.name);
              resolve(policy);
            });
          });
        });

        // Wait for all policyPromises to resolve
        Promise.all(policyPromises)
          .then((policiesWithTypes) => resolve(policiesWithTypes))
          .catch((error) => reject(error));
      });
    });
  }

  static getActivePolicies(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public.policy
      INNER JOIN public."policyStatus" USING("statusId")
      WHERE "status" = 'Attiva'`;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static getExpiringPolicies(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public.policy
      INNER JOIN public."policyStatus" USING("statusId")
      WHERE "status" = 'In Scadenza'`;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static checkExpiringPolices(db) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "statusId" = 2
      WHERE "endDate" BETWEEN current_date + interval '1 day' 
      AND current_date + interval '10 days'
		  AND "statusId" = 1`;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static checkSixMonthsExpiringPolices(db) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "statusId" = 4
      WHERE "duration" = 6
      AND "endDate" - interval '6 months' BETWEEN current_date + interval '1 day' 
      AND current_date + interval '10 day'`;
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.rows);
      });
    });
  }

  static checkExpiredPolices(db) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "statusId" = 3
      WHERE "endDate" <= current_date`;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static async checkSixMonthsExpiredPolices(db) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "statusId" = 5
      WHERE "duration" = 6
      AND "endDate" - interval '6 months' <= current_date`;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static changePolicyPaymentStatus(db, policyId, paymentStatusId) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "paymentStatusId" = $1
      WHERE "policyId" = $2`;

      const values = [paymentStatusId, policyId];

      db.query(query, values, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.rows);
      });
    });
  }

  static deletePolicy(db, policyId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM public."policy" WHERE "policyId" = $1`;

      db.query(query, [policyId], (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results.rows);
      });
    });
  }

  static async sendMessages(db) {
    const query = `SELECT * FROM public."policy" 
    INNER JOIN public."vehicle" USING("vehicleId")
    INNER JOIN public."client" ON public."policy"."clientId" = public."client"."clientId"
    WHERE "statusId" = 2 
    AND current_date + interval '3 days' = "endDate"`;
    db.query(query, (error, results) => {
      if (error) {
        console.log(error);
      }

      const policies = results.rows;
      policies.forEach(async (policy) => {
        await Messages.sendMessage(
          policy.phoneNumber,
          policy.endDate,
          policy.brand,
          policy.model,
          policy.licensePlate
        );
      });
    });
  }

  static async suspendPolicy(db, policyId) {
    return new Promise((resolve, reject) => {
      const checkQuery = `SELECT COUNT(*) FROM public."suspendedPolicy" WHERE "policyId" = $1`;

      db.query(checkQuery, [policyId], (error, results) => {
        if (error) {
          return reject(error);
        }

        const count = parseInt(results.rows[0].count, 10);

        if (count > 0) {
          // Policy already exists, proceed to update the policy status
          const updateQuery = `UPDATE public."policy" SET "statusId" = 6 WHERE "policyId" = $1`;
          db.query(updateQuery, [policyId], (error, results) => {
            if (error) {
              return reject(error);
            } else {
              resolve(results.rows);
            }
          });
        } else {
          // Insert the policy into suspendedPolicy and update the status
          const insertQuery = `INSERT INTO public."suspendedPolicy" ("policyId") VALUES ($1)`;
          db.query(insertQuery, [policyId], (error, results) => {
            if (error) {
              return reject(error);
            } else {
              const updateQuery = `UPDATE public."policy" SET "statusId" = 6 WHERE "policyId" = $1`;
              db.query(updateQuery, [policyId], (error, results) => {
                if (error) {
                  return reject(error);
                } else {
                  resolve(results.rows);
                }
              });
            }
          });
        }
      });
    });
  }

  static reactivatePolicy(db, policyId) {
    return new Promise(async (resolve, reject) => {
      // Step 1: Recupera la data di sospensione
      const selectSuspensionQuery = `
          SELECT "startSuspensionDate" 
          FROM public."suspendedPolicy" 
          WHERE "policyId" = $1
        `;
      db.query(selectSuspensionQuery, [policyId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const suspensionDate = result.rows[0].startSuspensionDate;

          // Verifica se suspensionDate è valido
          const suspensionStartDate = new Date(suspensionDate);
          if (isNaN(suspensionStartDate.getTime())) {
            return reject(new Error("Invalid suspension date format"));
          }

          // Step 2: Recupera le informazioni della polizza (inclusa la data di fine)
          const selectPolicyQuery = `SELECT "endDate" FROM public."policy" WHERE "policyId" = $1`;
          db.query(selectPolicyQuery, [policyId], (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result.rows.length === 0) {
                return reject(new Error("Policy not found"));
              }

              const endDate = result.rows[0].endDate;

              // Step 3: Calcola l'intervallo di sospensione in giorni usando JavaScript
              const currentDate = new Date(); // Data corrente

              // Calcola la differenza in millisecondi
              const differenceInMs = currentDate - suspensionStartDate;

              // Verifica che la differenza non sia negativa (data futura)
              if (differenceInMs < 0) {
                return reject(new Error("Suspension date is in the future"));
              }

              // Converti la differenza in giorni usando Math.ceil per includere anche porzioni di giorni
              const suspensionDays = Math.ceil(
                differenceInMs / (1000 * 60 * 60 * 24)
              );

              // Verifica se suspensionDays è valido
              if (suspensionDays <= 0 || isNaN(suspensionDays)) {
                return reject(new Error("Invalid suspension interval"));
              }

              // Step 4: Calcola la nuova data di fine della polizza
              const endDateObj = new Date(endDate);
              const newEndDateMilliseconds =
                endDateObj.getTime() + suspensionDays * 24 * 60 * 60 * 1000; // Aggiungi i giorni di sospensione in millisecondi
              const newEndDate = new Date(newEndDateMilliseconds);

              // Step 5: Aggiorna la data di fine della polizza nel database
              const updateEndDateQuery = `UPDATE public."policy" SET "endDate" = $1, "statusId" = 1 WHERE "policyId" = $2`;
              db.query(
                updateEndDateQuery,
                [
                  newEndDate.toISOString(), // Converti la data nel formato ISO 8601 per il database
                  policyId,
                ],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    if (result.rowCount === 0) {
                      return reject(
                        new Error(`Failed to update policy with id ${policyId}`)
                      );
                    }

                    // Step 6: Elimina la polizza dalla tabella suspendedPolicy
                    const deleteSuspendedPolicyQuery = `DELETE FROM public."suspendedPolicy" WHERE "policyId" = $1`;
                    db.query(
                      deleteSuspendedPolicyQuery,
                      [policyId],
                      (error, result) => {
                        if (error) {
                          reject(error);
                        } else {
                          if (result.rowCount === 0) {
                            return reject(
                              new Error(
                                `Failed to delete suspended policy with id ${policyId}`
                              )
                            );
                          }

                          // Risolvi la Promise se tutto va bene
                          resolve(result.rowCount);
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
    });
  }

  static async updateNote(db, policyId, note) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "note" = $1
      WHERE "policyId" = $2`;

      const values = [note, policyId];

      db.query(query, values, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.rows);
      });
    });
  }

  static async renewSixPolicy(db, policyId) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."policy"
      SET "statusId" = 1, "duration" = 12
      WHERE "policyId" = $1
      AND "statusId" = 5`;

      db.query(query, [policyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.rows);
      });
    });
  }
}

module.exports = PolicyModel;
