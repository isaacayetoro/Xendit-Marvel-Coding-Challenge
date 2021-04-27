const express = require('express');
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const rateLimit = require("express-rate-limit");
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);


const api = require('./api/routes');


app.use(express.json());


const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
            title: "Xendit Marvel Character API Coding Challenge",
            version: "1.0.0",
            description: "Endpoints for accessing Marvel characters",
            servers: ["http://localhost:8080"]
    },
    components: {
      securitySchemes: {
        api_key: {
          description: "Marvel public api key",
          type: "apiKey",
          name: "api_key",
          in: "header"
        }
      }
    }
  },
  apis: ["./api/routes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



// allow cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// use the router /
app.use('/', api);


// Error Handler
app.use(function (err, req, res, next) {

  // render the error page
  console.error(err);
    console.log(err.message);  
  res.status(500).send(err);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


 module.exports = app;