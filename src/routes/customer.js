const express = require('express');

const router = express.Router();

// QueryString => query property on the request object
// localhost:3000/person?name=samar&age=20 -> anything after question mark is part of a query string
router.get('/customers', (req, res)=> {
    if(req.query.name){
        res.send(`You have requested customer ${req.query.name} and his age is ${req.query.age}`);  
    }
    else
    {
    res.send('You have requested customers');
    }
})

// Params property on the request object
router.get('/customers/:name', (req, res)=> {
    res.send(`You have requested customer ${req.params.name}`);
})

router.get('/error', (req, res) => {
    throw new Error('Something has gone wrong with the server.')
})

module.exports = router;