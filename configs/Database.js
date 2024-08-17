// db.js
const { Pool } = require("pg");

/* const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "SpaceDesignAurora",
  password: "1234",
}); 
*/

const db = new Pool({
  user: "spacedesigndev",
  host: "lab.spacedesign-italia.it",
  database: "mp_insurance",
  password: "imusRbRLPsStwgZa",
});

module.exports = db;
