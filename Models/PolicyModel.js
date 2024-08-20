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
}

module.exports = PolicyModel;
