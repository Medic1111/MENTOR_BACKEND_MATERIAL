# Elaborating the Error Handler

Lets take a look at some mongoose Errors that we must manage: We can get DUPLICATE error, CAST error, and VALIDATION error

Beginning by validation, look in `index.js` and notice we are establishing a mongoose connection.

We then create a simple Schema to use for testing purposes.

The userSchema sets validation errors for the username field, and also specifies the username as being unique (otherwise, duplicate error)

If a rejected promise from mongoose takes place, the server crashes because we are not "catching" the errors.

When using catch in promises, we receive the error object. Simply passing it to next and returning solves the issue, and the server wont crash.

```
app.post("/api/v1/user", async (req, res, next) => {
  let newUser = req.body;
  let user = await User.create(newUser).catch((err) => next(err));
  if (user) return res.status(201).json(user);
});

```

After implementation, we can head to `endpoint.rest` to test the results. Sure enough we notice we receive the error, and the message sent by mongoose.

If we try to register another user with the same username, we will now receive the duplicate error sent by mongoose.

If we access the GET USER route, we trigger a Cast error.

After observing all 3 error types from mongoose,
notice how UNREADABLE those are...

Lets make our error handler function work better!

Uncomment the comment mongoose error functions, and the if checks for them on the err handler, and try again on the rest
