var mongoose = require('mongoose');

var accelerometerSchema = mongoose.Schema({
    payload: {
        x: {type: Number},
        y: {type: Number},
        z: {type: Number}
    },
    type: {type: String, index: true},
    timestamp: {type: Date, index: true},
    device: {type: String, index: true}

}, {collection: 'rawData', strict: false});

accelerometerSchema.index({timestamp: -1, type: 1, device: 1}, {unique: true});

mongoose.model('Accelerometer', accelerometerSchema);