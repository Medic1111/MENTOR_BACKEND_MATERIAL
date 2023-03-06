// REQUIRE PACKAGES:
const express = require("express");
const morgan = require("morgan"); // Development package that logs the requests in real time
require("dotenv").config(); // Tool to access and use .env file

// Instantiating express
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));

// FIRST ROUTE
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ message: "TEST PASSED" });
});

// UNHANDLED ROUTES
app.all("*", (req, res) => {
  res.status(404).json({ message: `${req.url} is not supported` });
});

// SETUP SERVER TO LISTEN ON A PORT
let PORT = 3002;

app.listen(process.env.PORT || PORT, (err) =>
  err ? console.log(err) : console.log(`Server Spinning on PORT ${PORT}`)
);
