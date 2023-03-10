// REQUIRE PACKAGES:
const express = require("express");
const morgan = require("morgan"); // Development package that logs the requests in real time
require("dotenv").config(); // Tool to access and use .env file
// security packages:
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
// Instantiating express
const app = express();

// MIDDLEWARE
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many requests from this IP, try again in an hour",
});
app.use(express.json());
app.use("/api", limiter);
app.use(morgan("dev"));
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// FIRST ROUTE
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ message: "TEST PASSED" });
});

app.get("/api/v1/error", (req, res, next) => {
  next({
    statusCode: 500,
    message: "Oops, something went wrong",
  });
});

// UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  // res.status(404).json({ message: `${req.originalUrl} is not supported` });
  // REFACTORING TO USE EXPRESS ERROR:
  next({ statusCode: 404, message: `${req.originalUrl} is not supported` });
});

// SETUP SERVER TO LISTEN ON A PORT
let PORT = 3002;

app.listen(process.env.PORT || PORT, (err) =>
  err ? console.log(err) : console.log(`Server Spinning on PORT ${PORT}`)
);

app.use((err, req, res, next) => {
  console.log(err);
  // Elaborate and address all possible errors here:
  let statusCode = err.statusCode || 500;
  let status = String(statusCode).startsWith("4") ? "Fail" : "Error";
  let message = err.message || "Oops, something went wrong";
  res.status(statusCode).json({ status, message });
});
