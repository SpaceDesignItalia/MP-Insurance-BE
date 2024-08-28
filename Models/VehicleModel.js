class VehicleModel {
  static GetClientVehicles(db, clientId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle" 
      LEFT JOIN public."policy" USING("vehicleId")
      LEFT JOIN public."insuranceCompany" USING("companyId")
      WHERE vehicle."clientId" = $1`;
      db.query(query, [clientId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  static GetClientVehiclesUninsured(db, clientId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle" v
      LEFT JOIN public."policy" p USING("vehicleId")
      LEFT JOIN public."insuranceCompany" ic USING("companyId")
      WHERE v."clientId" = $1
      AND p."vehicleId" IS NULL;`;

      db.query(query, [clientId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }
}

module.exports = VehicleModel;
