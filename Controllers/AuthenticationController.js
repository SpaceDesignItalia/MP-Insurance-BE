// controller/PermissionController.js
const Authentication = require("../Models/AuthenticationModel");

class AuthenticationController {
  static async login(req, res, db) {
    try {
      const LoginData = req.body.LoginData;
      const account = await Authentication.login(db, LoginData);

      // Imposta la durata del cookie di sessione
      req.session.cookie.maxAge = LoginData.remember
        ? 30 * 24 * 60 * 60 * 1000 // 30 giorni in millisecondi
        : 60 * 60 * 1000; // 1 ora in millisecondi

      delete account.password; // Elimina la password dall'oggetto account prima di salvare nella sessione

      req.session.account = account;

      res.status(200).json({
        message: "Login avvenuto con successo",
      });
    } catch (error) {
      console.error("Errore nel login:", error);
      res.status(500).send("Recupero dell'account fallito");
    }
  }

  static logout(req, res) {
    try {
      // Distruggi la sessione
      req.session.destroy((err) => {
        if (err) {
          console.error("Errore durante il logout:", err);
          return res.status(500).json({ error: "Errore interno del server" });
        }
        // Se la sessione è stata distrutta con successo, restituisci uno stato 200 (OK)
        return res
          .status(200)
          .json({ message: "Logout effettuato con successo" });
      });
    } catch (error) {
      console.error("Errore durante il logout:", error);
      return res.status(500).json({ error: "Errore interno del server" });
    }
  }

  static async GetSessionData(req, res) {
    // Verifica se la sessione è stata creata
    if (req.session.account) {
      // Verifica se l'utente è autenticato
      return res.status(200).json(req.session.account);
    } else {
      return res.status(401).json({ error: "Non autorizzato" });
    }
  }

  static async CheckSession(req, res) {
    try {
      // Verifica se la sessione è stata creata
      if (req.session.account) {
        // Verifica se l'utente è autenticato
        res.json(true);
      } else {
        res.json(false);
      }
    } catch (error) {
      console.error("Errore nel recupero della sessione:", error);
      res.status(500).send("Recupero nel recupero della sessione");
    }
  }

  static async requestPasswordReset(req, res, db) {
    try {
      const email = req.body.email;
      const account = await Authentication.requestPasswordReset(db, email);
      res.status(200).json({ message: "Richiesta di reset password inviata" });
    } catch (error) {
      console.error("Errore durante la richiesta di reset password:", error);
      res
        .status(500)
        .json({ message: "Errore durante la richiesta di reset password" });
    }
  }

  static async verifyOTP(req, res, db) {
    try {
      const email = req.body.email;
      const otp = req.body.otp;
      const account = await Authentication.verifyOTP(db, email, otp);

      if (!account) {
        return res
          .status(400)
          .json({ message: "OTP non valido o email non trovata" });
      }

      res.status(200).json({ message: "OTP verificato con successo" });
    } catch (error) {
      console.error("Errore durante la verifica OTP:", error);
      res.status(500).json({ message: "Errore durante la verifica dell'OTP" });
    }
  }

  static async resetPassword(req, res, db) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const otp = req.body.otp;
      console.log("email", email);
      console.log("password", password);
      console.log("otp", otp);
      const account = await Authentication.resetPassword(
        db,
        email,
        password,
        otp
      );
      res.status(200).json({ message: "Password resettata con successo" });
    } catch (error) {
      console.error("Errore durante il reset della password:", error);
      res
        .status(500)
        .json({ message: "Errore durante il reset della password" });
    }
  }
}

module.exports = AuthenticationController;
