// create sample data server script
// this script simulates the creation of data sent from accelerometers
// open mongo shell
// change to the database of your choice with: use your_database_name
// sample data will be written to the collection rawData


function randomAccelerometerOutput (min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sampleRange(min, max){
    // two random values to set chose range from
    var r1 = randomAccelerometerOutput(min, max),
        r2 = randomAccelerometerOutput(min, max);
    return [Math.min.apply(Math, [r1, r2]), Math.max.apply(Math, [r1, r2])]
}
function addSampleData(numberOfDevices, startDateTime,
                       recordsPerSecondPerDevice, createDataForSeconds) {
    var i;
    var min = -30,  // lower limit for sample data for payload x, y, & z
        max = 30;   // upper limit for sample data for payload x, y, & z
    // create numberOfDevices random devices (UUIDs)
    var theDevices = [];
    for (i = 1; i <= numberOfDevices; i++) {
        var device = "DVCE-" + ("0000" + i).substr(-5);
        theDevices.push(device);
    }
    print("created " + theDevices.length + " devices.");

    // create random sensor data, pick random device from list
    for (var s = 0; s < createDataForSeconds; s++) {
        startDateTime.setSeconds(startDateTime.getSeconds() + 1);
        print("creating data for datetime " + startDateTime);
        // set a random range for every second
        // for that second random data will be created within that range
        // thus we avoid the data being too random and a bit mor realistic
        // (too random -> data average =~0)

        var range_x = sampleRange(min, max),
            range_X_min = randomAccelerometerOutput(range_x[0], range_x[1]),
            range_X_max = randomAccelerometerOutput(range_X_min, range_x[1]);
        var range_y = sampleRange(min, max),
            range_Y_min = randomAccelerometerOutput(range_y[0], range_y[1]),
            range_Y_max = randomAccelerometerOutput(range_Y_min, range_y[1]);
        var range_z = sampleRange(min, max),
            range_Z_min = randomAccelerometerOutput(range_z[0], range_z[1]),
            range_Z_max = randomAccelerometerOutput(range_Z_min, range_z[1]);

        for (i = 0; i < recordsPerSecondPerDevice * numberOfDevices; i++) {
            var theDevice = theDevices[randomAccelerometerOutput(0, numberOfDevices - 1)];
            var data = {
                payload: {
                    x: randomAccelerometerOutput(range_X_min, range_X_max),
                    y: randomAccelerometerOutput(range_Y_min, range_Y_max),
                    z: randomAccelerometerOutput(range_Z_min, range_Z_max)
                },
                type: 'accelerometer',
                timestamp: new Date(startDateTime.setMilliseconds(randomAccelerometerOutput(0, 999))),
                device: theDevice
            };
            db.rawData.insert(data);
        }

    }
}

var numberOfDevices = 25,
    startDateTime = new Date("2015-01-31T23:00:00Z"),
    recordsPerSecondPerDevice = 1,
    createDataForSeconds = 3600;  // 86400 = one day


addSampleData(numberOfDevices, startDateTime, recordsPerSecondPerDevice, createDataForSeconds);