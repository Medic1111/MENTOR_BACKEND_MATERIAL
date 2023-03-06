# BASIC SERVER

1. To initiate a NODE project, run `npm init`:

2. To install dependencies needed:

- express
- morgan
- dotenv

> RUN
> `npm install express morgan dotenv`

3. In a `js` file, you must `require()` packages :

> Ex:

`const express = require('express')`
`const morgan = require('morgan')`
`require('dotenv').config()`

3. Create an instance of Express server:

`const app = express()`

4. Using the packages _middleware_ :

- After requiring, use the `app.use()` to utilize the packages

> In order to read req.body we must use a method from express:

`app.use(express.json())`

> In order to facilitate development, we use morgan which logs the requests coming in, and the status

`app.use(morgan("dev"))`

5. Creating a test route:

> Ex of a simple get route to test the server

```
app.get("/api/v1/test", (req,res)=>{
  res.status(200).json({message: "TEST PASSED"})
})
```

6. Handling unhandled routes (routes that are not supported by the server):

7. Allowing server to "listen" for requests:

```
let PORT = 3002;

app.listen(process.env.PORT || PORT, (err) =>
  err ? console.log(err) : console.log(`Server Spinning on PORT ${PORT}`)
);

```

8. START THE SERVER

- run `node name_of_file.js`

> PS: Installing NODEMON will allow for the server to restart automatically:

- install by running `npm install nodemon --save-dev`
- start server by running `nodemon name_of_file.js`

9. Checking for the test route

- Open `localhost:3002/api/v1/test`
- Your JSON should be seen
