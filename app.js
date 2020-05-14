const express = require('express');

const app = express();

var auth = [{ username: "samar", password: 12345 }]

// var auth2 = [{ username: "samar", password: 12345 }]

var list =
{
    "customers": [
        {
            "id": 2,
            "date": "2019-04-09",
            "custName": "Samarpit Verma",
            "relation": "S/O",
            "relative": "R K Verma",
            "village": "malawan",
            "phone": "8899822074",
            "ornaments": [
                {
                    "subDate": "2018-01-01",
                    "ornament": "Chain",
                    "metal": "Gold",
                    "weight": 10,
                    "rupees": 10000,
                    "priceofmetal": null
                }
            ]
        }
    ]
}


//Routes

app.get('/auth', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
    res.send(list);
})

// app.get('/customers', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//     res.send('hello');
// })

//How to we start listening to the server

app.listen(3000);