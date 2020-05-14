const express = require('express');
const app = express()
// const customerRoute = require('./routes/customer');  //for get from frontend
const customerRoute = require('./routes/customers'); // for post to database
const authRoute = require('./routes/auth')
const path = require('path');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
  });

app.use(bodyParser.json())

// app.use((req, res, next) => {
//     console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
//     next();
// })

// app.use(customerRoute); //for get from frontend
app.use(customerRoute); // for customer requests to database
app.use(authRoute); // for authenticating the user
// app.use(express.static('public'));

// Handler for 404 - Resource Not Found
app.use((req, res, next) =>{
    res.status(404).send('Error: 404, Page not found')
    next();
})

// Handler for 500 
app.use((err, res, req, next) =>{
    console.log(err.stack)
    // res.status(500).send('Error 500')
    res.sendFile('./Errors/500.html')
    res.end();
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> console.info(`Server has started on ${PORT}`))
