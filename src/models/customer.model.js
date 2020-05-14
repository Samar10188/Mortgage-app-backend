const mongoose = require('mongoose');

// const mongoDB = 'mongodb://localhost:27017/my_database'

// mongoose.connect(mongoDB, {'useNewUrlParser': true})
// mongoose.set('useCreateIndex', true);

let CustomerSchema = new mongoose.Schema({
//   id: {type: String, required: true},
  date: {type: String, required: true, default:"2019-10-04"},
  custName: {type: String, required: true},
  relation: {type: String, required: true},
  relative: {type: String, required: true},
  village: {type: String, required: true},
  phone: {type: String, required: true},
  ornaments: Array
})

module.exports = mongoose.model('Customer', CustomerSchema)
