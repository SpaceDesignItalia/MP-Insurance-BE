const bcrypt = require("bcrypt");
const EmailService = require("../middlewares/EmailService/EmailService");

class AuthenticationModel {
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

  static requestPasswordReset(db, email) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return new Promise((resolve, reject) => {
      const query = `UPDATE public."staffer" SET "passwordResetToken" = $1 WHERE "email" = $2`;
      db.query(query, [token, email], (error, result) => {
        if (error) {
          reject(error);
        } else {
          EmailService.sendOtpCode(email, token);
          resolve(result.rows[0]);
        }
      });
    });
  }

  static verifyOTP(db, email, otp) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."staffer" WHERE "email" = $1 AND "passwordResetToken" = $2`;
      db.query(query, [email, otp], (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result.rows.length === 1) {
            resolve(result.rows[0]);
          } else {
            reject(false);
          }
        }
      });
    });
  }

  static resetPassword(db, email, password, otp) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const query = `UPDATE public."staffer" SET "password" = $1 WHERE "email" = $2 AND "passwordResetToken" = $3`;
      db.query(query, [hashedPassword, email, otp], (error, result) => {
        if (error) {
          reject(error);
        } else {
          EmailService.sendPasswordResetConfirmation(email);
          resolve(result.rows[0]);
        }
      });
    });
  }
}

module.exports = AuthenticationModel;
