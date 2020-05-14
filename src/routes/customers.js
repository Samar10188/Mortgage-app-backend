const CustomerModel = require('../models/customer.model');
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/my_database';

// Create a new customer
// Post localhost:3000/customer
router.post('/customer/post', (req, res, next) => {

    if (!req.body.date) {
        return res.status(400).send('Request date is missing')
    }
    else if (!req.body.custName) {
        return res.status(400).send('Request custName is missing')
    }
    else if (!req.body.relation) {
        return res.status(400).send('Request relation is missing')
    }
    else if (!req.body.relative) {
        return res.status(400).send('Request relative is missing')
    }
    else if (!req.body.village) {
        return res.status(400).send('Request village is missing')
    }
    else if (!req.body.ornaments) {
        return res.status(400).send('Request ornaments is missing')
    }
    console.log(req.body);
    let model = new CustomerModel(req.body)
    // const model = {
    //     // id: req.body.id,
    //     date: req.body.date,
    //     custName: req.body.custName,
    //     relation: req.body.relation,
    //     relative: req.body.relative,
    //     village: req.body.village,
    //     phone: req.body.phone,
    //     ornaments: req.body.ornaments
    // };
    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err);
        if (err) {
            res.send('getting error while connecting to server')
        }
        var db = database.db('my_database');

        db.collection('Customers').insertOne(model, (err, result) => {
            assert.equal(null, err)
            if (err || !result) {
                console.log(err);
                database.close();
                return res.status(500).send('There is a problem inserting. The error is ', err)
            }
            res.status(201).send("Data inserted successfully!!")
            database.close();
        })
    })
})

//get request
router.get('/customer/get', (req, res, next) => {

    var resultArray = [];
    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err);
        if (err) {
            res.send('getting error while connecting to server')
        }
        var db = database.db('my_database');
        if (!req.query._id) {
            var cursor = db.collection('Customers').find();
            cursor.forEach((doc, err) => {
                assert.equal(null, err);
                resultArray.push(doc);
            }, () => {
                database.close();
                res.status(200).send(resultArray);
            })
        }
        else {
            console.log("req.query._id :", req.query._id);
            db.collection('Customers').findOne({ "_id": ObjectId(req.query._id) })
                .then(doc => {
                    console.log("status 201 and the doc value is", doc)
                    database.close();
                    res.status(201).json(doc)
                })
                .catch(err => {
                    console.log("status 500 and the doc value is", doc)
                    database.close();
                    res.status(500).json(err)
                })
        }
    })
})

// update request
router.put('/customer/update', (req, res, next) => {
    // console.log('req.body :',req.body)
    if (!req.body._id) {
        return res.status(400).send('Missing URL parameter: _id')
    }

    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err);
        if (err) {
            res.send('getting error while connecting to server')
        }
        var db = database.db('my_database');
        db.collection('Customers').updateOne({ "_id": ObjectId(req.body._id) }, {
            $set: {
                date: req.body.date,
                custName: req.body.custName,
                relation: req.body.relation,
                relative: req.body.relative,
                village: req.body.village,
                phone: req.body.phone,
                ornaments: req.body.ornaments
            }
        })
            .then(doc => {
                console.log("Data successfully updated!!");
                database.close();
                res.status(201).send("Data successfully updated!!");
            })
            .catch(err => {
                console.log("There is some error while updating. The error is ", err);
                database.close();
                res.status(500).send("There is some error while updating.").json(err);
            })
        // .then((doc, err) => {
        //     if(doc){
        //         console.log("status 201 and the doc value is", doc)
        //     database.close();
        //     res.status(201).json(doc)
        //     }
        //     else{
        //        console.log("status 500 and the doc value is", doc)
        //     database.close();
        //     res.status(500).json(err)
        //     }
        // })
        // CustomerModel.findOneAndUpdate({
        //     email: req.query.id
        // },
        //     req.body, {
        //     new: true
        // })
        //     .then(doc => {
        //         res.json(doc)
        //     })
        //     .catch(err => {
        //         res.status(500).json(err)
        //     })
        // next();
    })
})

// delete request
router.delete('/customer/delete', (req, res, next) => {

    if (!req.query._id) {
        return res.status(400).send('Missing URL parameter: _id')
    }

    MongoClient.connect(url, (err, database) => {
        assert.equal(null, err);
        if (err) {
            res.send('getting error while connecting to server')
        }
        var db = database.db('my_database');
        db.collection('Customers').findOneAndDelete({ "_id": ObjectId(req.query._id) })
            .then(doc => {
                if (doc.value) {
                    console.log("Cutomer deleted successfully!!", doc)
                    database.close();
                    res.status(201).send("Cutomer deleted successfully!!");
                }
                else {
                    console.log("Customer not found with the provided id")
                    database.close();
                    res.status(404).send("Customer not found with the provided id");
                }
            })
        // .catch(err => {
        //     console.log("Error while deleting customer")
        //     database.close();
        //     res.status(500).send("Error while deleting customer")
        // })
        // CustomerModel.findOneAndDelete({
        //     email: req.query.email
        // })
        //     .then(doc => {
        //         res.json(doc)
        //     })
        //     .catch(err => {
        //         res.status(500).json(err)
        //     })
        // // next();
    })
})


module.exports = router;