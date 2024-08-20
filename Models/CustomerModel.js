class StafferModel {
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
