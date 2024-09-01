class PolicyModel {
  static async getAllPolicies(db) {
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

  static getPolicyByVehicleId(db, vehicleId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT "policyId", CONCAT("firstName", ' ', "lastName") AS "fullName", "email", "typeId", "duration", 
        "amount", "startDate", "endDate","brand", "model", "licensePlate", "status", "paymentStatus", "companyName", "companyLogo"
        FROM public."policy" 
        INNER JOIN public."client" USING("clientId")
        INNER JOIN public."vehicle" USING("vehicleId")
        INNER JOIN public."policyStatus" USING("statusId")
        INNER JOIN public."policyPaymentStatus" USING("paymentStatusId")
        INNER JOIN public."insuranceCompany" USING("companyId")
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
            console.log(policyWithTypes);
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
        "amount", "startDate", "endDate", "licensePlate", "status", "paymentStatus"
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
      "duration", "amount", "clientId") VALUES ($1, $2, $3, $4, $5, $6, $7) 
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
      let query = `
            SELECT 
              public."policy"."policyId",
              "endDate",
              "firstName",
              "lastName",
              "phoneNumber",
              "email",
              "licensePlate",
              "brand",
              "model",
              "amount",
              "companyName"
            FROM public."policy"
            INNER JOIN public."client" ON public."policy"."clientId" = public."client"."clientId"
            INNER JOIN public."vehicle" ON public."policy"."vehicleId" = public."vehicle"."vehicleId"
            INNER JOIN public."insuranceCompany" ON public."policy"."companyId" = public."insuranceCompany"."companyId"
            
          `;

      db.query(query, (error, results) => {
        if (error) {
          console.log(error);
          return reject(error);
        }

        resolve(results.rows);
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
      WHERE "endDate" = current_date + interval '356 days'`;

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
      WHERE "endDate" = current_date`;

      db.query(query, (error, results) => {
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
}

module.exports = PolicyModel;
