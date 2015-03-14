var express = require('express');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var accelerometerModel = require('./models/Accelerometer');
var accelerometerData = require('./accelerometer-data.js');
var aggregate = require('./services/aggregate.js');
var testSampledata = require('./services/testSampleData.js');

config = {
    domain: "localhost", // host your mongodb is running on
    database: "iot_data", // mongodb database name
    mqtthost: "localhost" // optional host your mqtt host is running on
};


app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/cockpit', function (req, res) {
    res.render('cockpit');
});
app.get('/cockpit-aggregated', function (req, res) {
    res.render('cockpit-aggregated');
});
app.get('/cockpit-on-demand', function (req, res) {
    res.render('cockpit-on-demand');
});
app.post('/cockpit-on-demand', function (req, res) {
    console.log(req.body);
    //aggregate
    if (!req.body.datum) {res.status(406)}
    var datum = req.body.datum + "T00:00:00";

    if (!req.body.startHour) {
        var startHour = 0;
    } else {
        startHour = parseInt(req.body.startHour.split(':')[0]);
    }
    if (!req.body.endHour) {
        var endHour = 24;
    } else {
        endHour = parseInt(req.body.endHour.split(':')[0]);
    }
    console.log(datum, startHour, endHour);

    accelerometerData.accelerometerAggregateDay(
        datum,
        startHour,
        endHour,
        function(err, data){
        //console.log(err, data);
            if (!data[0] || err) {
                if (err) {
                    console.log(err);
                }
                data.push({count: 0, x: 0, y: 0, z: 0})
            }
            cockpitOnDemand.emit('message', data);

        }
    );

    res.send(req.body);
});
app.get('/notes', function (req, res) {
    res.render('notes');
});
app.post('/insert-random-data', function (req, res) {
    var records = req.body.n,
        devices = req.body.d;
    console.log(records, devices);
    var start = new Date();

    sampledata.createSampleData(records, devices, function (result) {
        console.log("took " + new Date() - start + " ms");
        console.log("had " + result + " errors");
        res.sendStatus(200);
    });

});
app.post('/test-insert-random-data', function (req, res) {
    //console.log(req.body);
    var numberOfDevices = req.body.numberOfDevices,
        startDateTime = new Date(req.body.startDateTime),
        recordsPerSecondPerDevice = req.body.recordsPerSecondPerDevice,
        createDataForSeconds = req.body.createDataForSeconds;
    console.log(numberOfDevices, startDateTime, recordsPerSecondPerDevice, createDataForSeconds);
    var start = new Date();

    testSampledata.createSampleData(numberOfDevices, startDateTime,
        recordsPerSecondPerDevice, createDataForSeconds, function (result) {
            console.log("took " + new Date() - start + " ms");
            console.log("had " + result + " errors");
            res.sendStatus(200);
        });

});

// #### WEB SERVER ####
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port)
});

var mqttClient = mqtt.createClient(1883, config.mqtthost);

// #### MONGODB ####
accelerometerData.connectDB('mongodb://' + config.domain + '/' + config.database)
    .then(console.log('connected to mongodb successfully')
);

// #### SOCKET.IO ####
var io = require('socket.io').listen(server, {log: true});

// #### SOCKET.IO COCKPIT ROOM ####
var cockpit = io.of('/cockpit', function (cockpit) {
    cockpit.on('connection', function (socket) {
        console.log('cockpit registered');
    });
    cockpit.on('cockpit', function (data) {
        console.log('cockpit said: ' + data);
    });
});

// #### SOCKET.IO COCKPIT AGGREGATED ROOM ####
var cockpitAggregated = io.of('/cockpitAggregated', function (cockpitAggregated) {
    cockpitAggregated.on('connection', function (socket) {
        console.log('cockpitAggregated registered');
    });
    cockpitAggregated.on('cockpit', function (data) {
        console.log('cockpitAggregated said: ' + data);
    });
});

// #### SOCKET.IO COCKPIT ON DEMAND ROOM ####
var cockpitOnDemand = io.of('/cockpitOnDemand', function (cockpitOnDemand) {
    cockpitOnDemand.on('connection', function (socket) {
        console.log('cockpitOnDemand registered');
    });
    cockpitOnDemand.on('cockpit', function (data) {
        console.log('cockpitOnDemand said: ' + data);
    });
});

var seconds = 1;
setInterval(function () {
    var end = new Date(),
        start = new Date();
    start.setSeconds(start.getSeconds() - seconds);
    accelerometerData.accelerometerAverages(start, end, function (err, data) {
        //console.log(err, data);
        if (!data[0] || err) {
            if (err) {
                console.log(err);
            }
            data.push({count: 0, x: 0, y: 0, z: 0})
        }
        cockpitAggregated.emit('message', data[0]);
    });
}, 1000 * seconds);


// #### SENSOR DATA VIA MQTT / ####
mqttClient.subscribe('persisted/device/+/accelerometer');
mqttClient.on('message', function (topic, rawMsg) {
    var msg = JSON.parse(rawMsg.toString());
    var id = msg._id;
    accelerometerData.findOneAccelerometerById({_id: id})
        .then(function (data) {
            if (!data) {return;}
            if ("accelerometer" != data.type) {return;}
            cockpit.emit('message', data);
        });
});


// #### SOCKET.IO ACCELEROMETER ROOM / ####
io.on('connection', function (socket) {
// check for data labeled 'acceleration'
    console.log('a user connected');
    //console.log(socket);
    socket.on('acceleration', function (data) {
        //console.log(data);
        accelerometerData.createAccelerometer(data);
        cockpit.emit('message', data);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});