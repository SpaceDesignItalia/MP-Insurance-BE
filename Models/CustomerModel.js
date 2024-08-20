class StafferModel {
  static getAllCustomers(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public.client ORDER BY "firstName" ASC `;

      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  static searchCustomer(db, searchTerm) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public.client WHERE "firstName" ILIKE $1 
       OR "lastName" ILIKE $1 
       OR "email" ILIKE $1 
       ORDER BY "firstName" ASC`;

      const value = [`%${searchTerm}%`];

      db.query(query, value, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  static createNewCustomer(db, CustomerData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO public.client("firstName", "lastName", "phoneNumber", "email")
	  VALUES ( $1, $2, $3, $4) RETURNING "clientId"`;

      const values = [
        CustomerData.firstName,
        CustomerData.lastName,
        CustomerData.phoneNumber,
        CustomerData.email,
      ];

      db.query(query, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0].clientId);
        }
      });
    });
  }

  static createNewVehicle(db, VehicleData, newCustomerId) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO public.vehicle("licensePlate", brand, model, "typeId", "clientId")
	  VALUES ($1, $2, $3, $4, $5);`;

      const values = [
        VehicleData.licensePlate,
        VehicleData.brand,
        VehicleData.model,
        VehicleData.veichleTypeId,
        newCustomerId,
      ];

      db.query(query, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = StafferModel;
