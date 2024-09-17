const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const http = require("http");
const axios = require("axios");
require("dotenv").config();
const FormData = require("form-data");
const fs = require("fs");

//Main Routes declaration
const createAuthenticationRoutes = require("./Routes/Authentication/Authentication");
const createCustomerRoutes = require("./Routes/Customer/Customer");
const createVehicleRoutes = require("./Routes/Vehicle/Vehicle");
const createCompanyRoutes = require("./Routes/Company/Company");
const createPolicyRoutes = require("./Routes/Policy/Policy");
const createFileGeneratorRoutes = require("./Routes/FileGenerator/FileGenerator");

const app = express();
app.use(express.static("public"));
const PREFIX = "/API/v1";
const PORT = 3000;

const db = require("./configs/Database");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  session({
    secret: "T^pX#z1$0%V@l2&nHbO8yGcLsAaE!WuPq4Rv7*3Sd9MwYjNfCmKgJiBkD5F",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);
app.use(cookieParser());

const server = http.createServer(app);

//Main routes
app.use(PREFIX + "/Authentication", createAuthenticationRoutes(db));
app.use(PREFIX + "/Vehicle", createVehicleRoutes(db));
app.use(PREFIX + "/Company", createCompanyRoutes(db));
app.use(PREFIX + "/Policy", createPolicyRoutes(db));
app.use(PREFIX + "/Customer", createCustomerRoutes(db));
app.use(PREFIX + "/FileGenerator", createFileGeneratorRoutes(db));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
