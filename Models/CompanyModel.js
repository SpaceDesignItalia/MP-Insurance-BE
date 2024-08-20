class CompanyModel {
  static GetAllCompanies(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."insuranceCompany"`;
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  static GetAllInsuranceTypes(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."insuranceType"`;
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows);
        }
      });
    });
  }
}

module.exports = CompanyModel;
