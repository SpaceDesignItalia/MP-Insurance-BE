class PolicyModel {
  static AddPolicy(
    db,
    clientId,
    vehicleId,
    companyId,
    startDate,
    endDate,
    duration,
    amount,
    insuranceTypeId
  ) {
    return new Promise((resolve, reject) => {
      let query = `
            INSERT INTO public."policy" ("vehicleId", "companyId", "startDate", "endDate", "duration", "amount", "statusId", "clientId") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING "policyId"
          `;

      db.query(
        query,
        [
          vehicleId,
          companyId,
          startDate,
          endDate,
          duration,
          amount,
          1, // Assuming statusId is always 1
          clientId,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
            return reject(error);
          }

          const policyId = results.rows[0]["policyId"];

          let query = `INSERT INTO public."policyTypes" ("policyId", "insuranceTypeId") VALUES ($1, $2)`;

          const promises = [];

          insuranceTypeId.forEach((type) => {
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

          // Wait for all policyTypes inserts to finish
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
}

module.exports = PolicyModel;
