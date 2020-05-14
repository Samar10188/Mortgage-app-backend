const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/my_database'

mongoose.connect(mongoDB, {'useNewUrlParser': true})
mongoose.set('useCreateIndex', true);

let AuthSchema = new mongoose.Schema({
//   id: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true}
})

module.exports = mongoose.model('Auth', AuthSchema)
