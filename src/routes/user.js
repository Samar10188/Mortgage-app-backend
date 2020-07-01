const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/my_database';
const jwt = require('jsonwebtoken');

const User = require('../models/user.model')

// MongoClient.connect(url, (err, database) => {
//     assert.equal(null, err)
//     if (err) {
//         res.send('getting error while connecting to the database')
//     }
// const db = database.db('my_database');


router.post('/registration', (req, res, next) => {
    // console.log("req details :", req.body);
    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err)
        if (err) {
            res.send('getting error while connecting to the database')
        }

        var db = database.db('my_database');

        db.collection('Auth').findOne({ "username": req.body.username })
            .then(user => {
                if (user) {
                    return res.status(409).json({
                        message: "username exists !"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {

                        if (err) {
                            console.log("error :", err)
                            db.close();
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: mongoose.Schema.Types.ObjectId,
                                username: req.body.username,
                                password: hash
                            });
                            db.collection('Auth').insertOne(user)
                                .then(result => {
                                    // console.log(result);
                                    res.status(201).json({
                                        message: 'User created !!'
                                    });
                                    db.close();
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                    db.close()
                                });
                        }

                    })
                }
            })
    })

})

router.post('/login', (req, res, next) => {
    console.log("req body :", req.body);
    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err)
        if (err) {
            res.send('getting error while connecting to the database')
        }
        var db = database.db('my_database');

        db.collection('Auth').findOne({ "username": req.body.username })
            .then(user => {
                console.log("User :", user);
                if (!user) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                username: user.username,
                                userId: user._id
                            },
                            process.env.JWT_KEY,
                            // { algorithm: 'RS256' },
                            { expiresIn: "1h" }
                        )
                        return res.status(200).json({
                            message: "Authentication Successful",
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: "Authentication failed"
                        });
                    }
                    db.close();
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
                db.close()
            });
    })
})

router.delete('/delete', (req, res, next) => {
    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err)
        if (err) {
            res.send('getting error while connecting to the database')
        }
        var db = database.db('my_database');

        db.collection('Auth').findOneAndDelete({ "username": req.query.username })
            .then(doc => {
                if (doc.value) {
                    console.log("User deleted ", doc)
                    database.close();
                    res.status(200).json({
                        message: 'User deleted'
                    });
                }
                else {
                    console.log("User not found !!")
                    database.close();
                    res.status(404).json({
                        message: 'User not found !!'
                    });
                }
            });
    });
})

module.exports = router;