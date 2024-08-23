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

  static searchPolicy(db, searchTerms) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p."policyId", CONCAT(c."firstName", ' ', c."lastName") AS "fullName", v."typeId", 
      it."name" AS "insuranceType", p."duration", p."amount", p."startDate", p."endDate", ps."status",  pps."paymentStatus"
      FROM public."policy" p INNER JOIN USING("clientId") INNER JOIN public."vehicle" v USING("vehicleId")
      INNER JOIN public."policyStatus" ps USING("statusId") INNER JOIN public."policyPaymentStatus" pps USING("paymentStatusId")
      INNER JOIN public."policyTypes" pt USING("policyId") INNER JOIN public."insuranceType" it USING("insuranceTypeId")
      WHERE (CONCAT(c."firstName", ' ', c."lastName") ILIKE '%${searchTerms.searchQuery}%') 
      OR (v."licensePlate" ILIKE '%${searchTerms.searchQuery}%')
      AND (v."typeId" = $1 OR null IS NULL)
      AND (it."insuranceTypeId" = $2 OR null IS NULL) 
      AND (p."duration" = $3 OR null IS NULL)
      AND (ps."status" = $4 OR null IS NULL) 
      AND (pps."paymentStatus" = $5 OR null IS NULL);`;

      const values = [
        searchTerms.typeId,
        searchTerms.insuranceTypeIds,
        searchTerms.duration,
        searchTerms.status,
        searchTerms.paymentStatus,
      ];
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
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
}

module.exports = PolicyModel;
