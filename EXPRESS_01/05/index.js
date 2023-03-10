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

//CONNECTING TO DB TO TEST ERRORS
const mongoose = require("mongoose");

mongoose.set("strictQuery", "false");
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));
// SCHEMA/MODEL

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    maxLength: [12, "Maximum 12 chars"],
    minLength: [3, "Minimum 3 chars"],
    required: [true, "Username is required"],
    unique: [true, "Username already registered"],
  },
});

const User = mongoose.model("User", userSchema);

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

// ERROR TESTING ROUTE
app.get("/api/v1/error", (req, res, next) => {
  next({
    statusCode: 500,
    message: "Oops, something went wrong",
  });
});
//  New Errors to consider:
app.post("/api/v1/user", async (req, res, next) => {
  let newUser = req.body;
  let user = await User.create(newUser).catch((err) => next(err));
  if (user) return res.status(201).json(user);
});

app.get("/api/v1/user", async (req, res, next) => {
  let newUser = req.body;
  // THIS WILL TRIGGER A CAST ERROR, BECAUSE WE
  // are passing username instead of ID
  let user = await User.findById(newUser).catch((err) => next(err));
  if (user) return res.status(201).json(user);
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

// COSTUMIZING MONGOOSE ERRORS

// const handleCastErrDB = (err) => {
//   err.message = `Invalid ${err.path}`;
//   err.statusCode = 500;
//   return err;
// };

// const handleDuplicateDB = (err) => {
//   err.statusCode = 409;
//   err.message = `Duplicate field. Choose another value`;
//   return err;
// };

// const handleValidationDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   err.statusCode = 422;
//   err.message = `Invalid Input Data: ${errors}`;
//   return err;
// };

app.use((err, req, res, next) => {
  console.log(err);

  // if (err.name === "CastError") err = handleCastErrDB(err);
  // if (err.code === 11000) err = handleDuplicateDB(err);
  // if (err.errors) err = handleValidationDB(err);

  let statusCode = err.statusCode || 500;
  let status = String(statusCode).startsWith("4") ? "Fail" : "Error";
  let message = err.message || "Oops, something went wrong";
  res.status(statusCode).json({ status, message });
});
