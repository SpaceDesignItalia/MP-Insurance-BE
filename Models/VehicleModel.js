class VehicleModel {
  static GetClientVehicles(db, clientId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle" 
      INNER JOIN public."policy" USING("vehicleId")
      INNER JOIN public."insuranceCompany" USING("companyId")
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
}

module.exports = VehicleModel;
