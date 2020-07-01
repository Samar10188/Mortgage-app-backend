const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
// const mongoDB = "mongodb://localhost:27017/my_database";
// const url = require('url');

const customerRoutes = require('./src/routes/customers'); // for post to database
const authRoutes = require('./src/routes/auth')
const userRoutes = require('./src/routes/user')
// const path = require('path');


// mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-type,Authorization,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
});

app.use(bodyParser.json())

app.use("/customer", customerRoutes);     // for customer requests to database
app.use(authRoutes);         // for authenticating the user
app.use("/user", userRoutes);         // for authenticating the user


// Handler for 404 - Resource Not Found
app.use((err, req, res, next) => {
    console.log("404", err);
    res.status(404).json({
        message: "Page not found !!"
    })
    next();
})

// Handler for 500 
app.use((err, req, res, next) => {
    console.log("500 error", err)
    // res.status(500).send('Error 500')
    res.status(500).send('Something went Wrong')
    res.end();
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> console.info(`Server has started on ${PORT}`))

// module.exports = app;