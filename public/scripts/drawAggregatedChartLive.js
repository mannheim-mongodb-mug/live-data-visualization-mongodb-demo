randomAccelerometerOutput = function (min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// create random data / fallback if no mongod/livedata
randomData = function() {
    var min = -10,
        max = 10;
    var data = {
        count: randomAccelerometerOutput(5, 30),
        x: randomAccelerometerOutput(min, max),
        y: randomAccelerometerOutput(min, max),
        z: randomAccelerometerOutput(min, max)
    };
    return data;
};

var cockpitAggregated = io.connect('http://localhost:3000/cockpitAggregated');
cockpitAggregated.emit('cockpit', 'hello');
cockpitAggregated.on('message', function(data){
    //console.log(data);
    //data = randomData(); // uncomment to use random data instead of live data
    if (!data.count) {var cnt = 0} else {var cnt = data.count}
    document.getElementById('counted').innerHTML = cnt;
    tick(data);
});