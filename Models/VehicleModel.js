class VehicleModel {
  static GetClientVehicles(db, clientId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle" 
      LEFT JOIN public."policy" USING("vehicleId")
      LEFT JOIN public."insuranceCompany" USING("companyId")
      WHERE vehicle."clientId" = $1`;
      db.query(query, [clientId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
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

      db.query(query, [clientId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static addNewVehicle(db, clientId, vehicleData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO public.vehicle(
      "licensePlate", brand, model, "typeId", "clientId")
      VALUES ($1, $2, $3, $4, $5);`;

      const values = [
        vehicleData.licensePlate,
        vehicleData.brand,
        vehicleData.model,
        vehicleData.veichleTypeId,
        clientId,
      ];

      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  }

  static getAllVehicles(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle"`;
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  static getVehicleById(db, vehicleId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."vehicle" WHERE "vehicleId" = $1`;

      db.query(query, [vehicleId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0]);
        }
      });
    });
  }

  static updateVehicleData(db, vehicleData) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."vehicle" SET
      "licensePlate" = $1, brand = $2, model = $3
      WHERE "vehicleId" = $4`;
      const values = [
        vehicleData.licensePlate,
        vehicleData.brand,
        vehicleData.model,
        vehicleData.vehicleId,
      ];
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static deleteVehicle(db, vehicleId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM public."vehicle" WHERE "vehicleId" = $1`;
      db.query(query, [vehicleId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = VehicleModel;
