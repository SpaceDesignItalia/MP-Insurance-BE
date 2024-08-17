const bcrypt = require("bcrypt");

class StafferModel {
  static login(db, LoginData) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."staffer" WHERE "email" = $1`;

      db.query(query, [LoginData.email], (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result.rows.length === 1) {
            const isPasswordValid = bcrypt.compareSync(
              LoginData.password,
              result.rows[0].password
            );
            if (isPasswordValid) {
              resolve(result.rows[0]);
            } else {
              reject(false);
            }
          } else {
            resolve(false);
          }
        }
      });
    });
  }
}

module.exports = StafferModel;
