var mongoose = require("mongoose");
var Promise = require("bluebird");

var Accelerometer = mongoose.model('Accelerometer');

var createAccelerometer = Promise.promisify(Accelerometer.create, Accelerometer);

var findOneAccelerometerById = Promise.promisify(Accelerometer.findOne, Accelerometer);


accelerometerAverages = function(start, end, callback){
    Accelerometer.aggregate([
        {$match: {timestamp: {$gt: start, $lte: end}}},
        {$group: {_id: '$device',
            count: {$sum: 1},
            x: {$avg: '$payload.x'},
            y: {$avg: '$payload.y'},
            z: {$avg: '$payload.z'}
        }},
        {$group: {_id: null,
            count: {$sum: '$count'},
            x: {$avg: '$x'},
            y: {$avg: '$y'},
            z: {$avg: '$z'}
        }}
    ], callback);

};

accelerometerAggregateDay = function(date, startHour, endHour, callback){
    var start = new Date(date);
    start.setHours(startHour);
    var end = new Date(date);
    end.setHours(endHour);
    console.log(date, startHour, endHour, start, end);
    Accelerometer.aggregate([
        {$match: {timestamp: {$gte: start, $lte: end}}},
        {$project: {
            day: {$dayOfYear: "$timestamp"},
            hour: {$hour: "$timestamp"},
            minute: {$minute: "$timestamp"},
            payload: "$payload"
        }},
        {$group: {_id: {day: "$day", hour: "$hour", minute: "$minute"},
            count: {$sum: 1},
            x: {$avg: '$payload.x'},
            y: {$avg: '$payload.y'},
            z: {$avg: '$payload.z'}
        }},
        {$sort: {_id: 1}}
    ], callback);

};

exports.connectDB = Promise.promisify(mongoose.connect, mongoose);

exports.createAccelerometer = createAccelerometer;

exports.Accelerometer = Accelerometer;
exports.findOneAccelerometerById = findOneAccelerometerById;

exports.accelerometerAverages = accelerometerAverages;
exports.accelerometerAggregateDay = accelerometerAggregateDay;