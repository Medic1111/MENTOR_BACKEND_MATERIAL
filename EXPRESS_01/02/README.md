# STARTING WITH SECURITY

As is... the server is rather insecure and very vulnerable. In order to address some security concerns, we need to install some packages that will help us in the process:

## PACKAGES:

- express-rate-limit
- express-mongo-sanitize // For later when we integrate DB
- xss-clean
- hpp
- helmet

To do that: run `npm i express-rate-limit helmet express-mongo-sanitize xss-clean hpp`

## SECURING THE SERVER

### LIMITING REQUESTS

1. Limiting requests from a particular IP: Helps prevent the system from fake requests or other brute force attacks

- Package: express-rate-limit

> STEPS:

1. Require express-rate-limit:
   `const rateLimit = require('express-rate-limit')`

2. Configuring the package: It is not necessary to store the configuration in a variable. But its good for reading and learning purposes.

```
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many requests from this IP, try again in an hour",
});

```

> Properties:
> max: total number of requests allowed from a single IP
> window: Window of time the user have to make those request, in this example, the user cannot send more than 100 request per hour
> message: Message sent to the user in case the limit is exceed

3. Using the package: Being a middleware, we must bind it to the app.

`app.use("/api", limiter);`

### SANITIZING INPUTS DB

1.Prevention against query injection attacks:

- Package: express-mongo-sanitize

> STEPS:

1. Require express-mongo-sanitize:
   `const mongoSanitize = require("express-mongo-sanitize");`

2. Using it: The package works out of the box, no need to extensive configuration or anything:

`app.use(mongoSanitize());`

### PREVENTING CROSS-SITE SCRIPTING WITH XSS

1.Prevention against cross-site scripting:

- Package: xss-clean

> STEPS:

1. Require xss-clean:
   `const xss = require("xss-clean");`

2. Using it: The package works out of the box, no need to extensive configuration or anything:

`app.use(xss());`

### PREVENTING QUERY POLUTION WITH HPP

1.Prevention against cross-site scripting:

- Package: hpp

> STEPS:

1. Require hpp:
   `const hpp = require("hpp");`

2. Using it: The package works out of the box, no need to extensive configuration or anything:

`app.use(hpp());`

### SOME SERIOUS PROTECTION WITH HELMET

1. Helmet is an express middleware that out of the box uses 14 smaller middleware for protection:

- Package: helmet

> STEPS:

1. Require helmet:
   `const helmet = require("helmet");`

2. Using it: The package works out of the box implementing all 14 mentioned middlewares:

`app.use(helmet());`

> Attention: Dependending on the application needs, this will need to be heavily configures, or you will have to pick and choose from the smaller middlewares

- Picking individual middlewares instead of using all:

```

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

```

For more information, please refer to all the packages docs.

#### FINAL STEP:

- Run the server
- Access the test route
- Open dev tools
- Select: network
- Refresh the browser and notice the api call being made
- Once you click on it, you will have access to the request headers which is now SECURED
