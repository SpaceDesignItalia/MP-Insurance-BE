class ClientModel {
  static GetAllClients(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM public."client"`;

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

module.exports = ClientModel;
