# HANDLING ERRORS

Express comes with Error Handling Out of the box.

Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next). For example:

```
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

```

It must be defined LAST in the middlewares

To use the error, call `next(pass_error_here)`

# Creating a simple Error Handler:

```
app.use((err, req, res, next) => {
  console.log("Middleware error handling: ", err);

  // Elaborate and address all possible errors here:

  let statusCode = err.statusCode || 500;
  let status = String(statusCode).startsWith("4") ? "Fail" : "Error";
  let message = err.message || "Oops, something went wrong";

  res.status(statusCode).json({ status, message });
});
```

> Attention, this has to be the VERY LAST middleware being used.

Using this error is simple. Simply call `next` and pass the error object. In this example, lets create an error route:

```
app.get("/api/v1/error", (req, res, next) => {
  next({
    statusCode: 500,
    message: "Oops, something went wrong",
  });
});
```

From now on, ALL controllers, will also receive next to be used in case of any operational error.

Next will always receive the Error object and evaluate according to you Err Controller
