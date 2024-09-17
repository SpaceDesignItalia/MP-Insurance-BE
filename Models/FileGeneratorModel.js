class FileGeneratorModel {
  // Recupera tutte le polizze che scadono questo mese
  static getPoliciesExpiringThisMonth(db) {
    return new Promise((resolve, reject) => {
      // Esegui la query per recuperare le polizze
      const query = `
        SELECT p."policyId", CONCAT(c."firstName", ' ', c."lastName") AS "fullName", c."phoneNumber", c."email", v."licensePlate", 
        v."brand", v."model", ic."companyName", p."duration", p."startDate", p."endDate", ps."status", pps."paymentStatus", p."note"
        FROM public."policy" p
        INNER JOIN public."client" c USING("clientId")
        INNER JOIN public."vehicle" v USING("vehicleId")
        INNER JOIN public."insuranceCompany" ic USING("companyId")
        INNER JOIN public."policyPaymentStatus" pps USING("paymentStatusId")
        INNER JOIN public."policyStatus" ps USING ("statusId")
        LEFT JOIN public."suspendedPolicy" sp ON sp."policyId" = p."policyId"
        WHERE EXTRACT(MONTH FROM p."endDate") = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM p."endDate") = EXTRACT(YEAR FROM CURRENT_DATE)
          AND sp."policyId" IS NULL;`;

      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const policies = results.rows;

          // Per ogni polizza, ottieni i tipi di polizza
          const policyIds = policies.map((p) => p.policyId);
          const typesQuery = `
            SELECT pt."policyId", it."name" 
            FROM public."policyTypes" pt
            INNER JOIN public."insuranceType" it USING("insuranceTypeId")
            WHERE pt."policyId" = ANY($1)
          `;

          db.query(typesQuery, [policyIds], (error, typesResults) => {
            if (error) {
              reject(error);
            } else {
              // Mappa i tipi di polizza per ogni polizza
              const typesMap = typesResults.rows.reduce((acc, row) => {
                if (!acc[row.policyId]) {
                  acc[row.policyId] = [];
                }
                acc[row.policyId].push(row.name);
                return acc;
              }, {});

              // Aggiungi i tipi di polizza alle polizze
              const policiesWithTypes = policies.map((policy) => ({
                ...policy,
                types: typesMap[policy.policyId] || [],
              }));

              resolve(policiesWithTypes);
            }
          });
        }
      });
    });
  }
}

module.exports = FileGeneratorModel;
