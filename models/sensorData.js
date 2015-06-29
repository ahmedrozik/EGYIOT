var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');

var schema = mongoose.Schema({
    _id: { type: String, required: true}
  , name: { type: String, required: true }
  , value: { type: String, required: true}

});

// add created date property
schema.plugin(createdDate);

// properties that do not get saved to the db
schema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
})

module.exports = mongoose.model('SensorData', schema);
