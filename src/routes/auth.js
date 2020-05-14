const AuthModel = require('../models/auth.model');
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/my_database';


router.get('/auth', (req, res) => {
    var model = new AuthModel(req.query);
    // console.log("model value is :", model);
    resultArray = [];

    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err)
        if (err) {
            res.send('getting error while connecting to the database')
        }

        var db = database.db('my_database');
        var cursor = db.collection('Auth').find({});
        cursor.forEach((doc, err) => {
            assert.equal(null, err);
            resultArray.push(doc);
            console.log("Result array :", resultArray);
        }, () => {
            database.close();
            auth(resultArray, model);
            function auth(resultArray, model) {
                for (let i = 0; i < resultArray.length; i++) {
                    if ((resultArray[i].username == model.username) && (resultArray[i].password == model.password)) {
                        console.log("Successfully logged in!!");
                        return res.status(201).send(true);   
                    }
                }
                console.log("Wrong Credentials");
                return res.status(404).send(false);
            }
        })
    })
})

module.exports = router;