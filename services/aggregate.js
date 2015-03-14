var accelerometerModel = require('./../models/Accelerometer');
var accelerometerData = require('./../accelerometer-data.js');
var rand = require('./randomStuff.js');

exports.getData = function (day, startHour, endHour) {
    var i;
    var min = -10,
        max = 10;
    // create numberOfDevices random devices (uuids)
    var theDevices = [];
    for (i = 0; i < numberOfDevices; i++) {
        var device = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        theDevices.push(device);
    }

    // eingabe n records von y devices pro device z pro sekunde


    // create random sensor data, pick random device from list
    var countErrors = 0;
    for (i = 0; i < records; i++) {
        var theDevice = theDevices[rand.randomAccelerometerOutput(0, numberOfDevices-1)];
        var data = {
            payload: {
                x: rand.randomAccelerometerOutput(min, max),
                y: rand.randomAccelerometerOutput(min, max),
                z: rand.randomAccelerometerOutput(min, max)
            },
            type: 'accelerometer',
            timestamp: new Date(),
            device: theDevice
        };
        //console.log(data);
        accelerometerData.Accelerometer.create(data, function (err, result) {
            if (err) {
                //console.log(data);
                countErrors++;
            }
        });
        //console.log(data);
    }
    callback(countErrors);
};