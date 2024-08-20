function authenticateMiddleware(req, res, next) {
  if (req.session && req.session.account) {
    next(); // L'utente è autenticato, procedi
  } else {
    res.status(401).json({ message: "Accesso non autorizzato" });
  }
}

module.exports = authenticateMiddleware;
