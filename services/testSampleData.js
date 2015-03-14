// generate some sample data for 'On Demand Aggregation'
//
var accelerometerModel = require('./../models/Accelerometer');
var accelerometerData = require('./../accelerometer-data.js');
var rand = require('./randomStuff.js');

exports.createSampleData = function (numberOfDevices, startDateTime,
                                     recordsPerSecondPerDevice , createDataForSeconds, callback) {
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
    console.log("created " + theDevices.length + " devices.");

    // create random sensor data, pick random device from list
    var countErrors = 0;
    for (var s = 0; s < createDataForSeconds; s++) {
        startDateTime.setSeconds(startDateTime.getSeconds() + 1);
        console.log("creating data for datetime " + startDateTime);
        // set random range for this second (otherwise avg ~0 for all
        var range_X_min = rand.randomAccelerometerOutput(min, max),
            range_X_max = rand.randomAccelerometerOutput(range_X_min, max),
            range_Y_min = rand.randomAccelerometerOutput(min, max),
            range_Y_max = rand.randomAccelerometerOutput(range_Y_min, max),
            range_Z_min = rand.randomAccelerometerOutput(min, max),
            range_Z_max = rand.randomAccelerometerOutput(range_Z_min, max);

        for (i = 0; i < recordsPerSecondPerDevice * numberOfDevices; i++) {
            var theDevice = theDevices[rand.randomAccelerometerOutput(0, numberOfDevices - 1)];
            var data = {
                payload: {
                    x: rand.randomAccelerometerOutput(range_X_min, range_X_max),
                    y: rand.randomAccelerometerOutput(range_Y_min, range_Y_max),
                    z: rand.randomAccelerometerOutput(range_Z_min, range_Z_max)
                },
                type: 'accelerometer',
                timestamp: startDateTime.setMilliseconds(rand.randomAccelerometerOutput(0, 999)),
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

    }
    callback(countErrors);
};
