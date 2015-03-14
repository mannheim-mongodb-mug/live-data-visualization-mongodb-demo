var factor = 10;
var collectedInfo;
var lastInfo = {x: 0, y: 0, z: 0};
var emitInfo;
var stall = 100;  // stall next n messages
var stalling = false;  // simulate loss of connection
var stalled = 0;
var stalledMessages = [];
var c = {};
var sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});

var socket = io.connect('http://' + location.host, {
    'reconnect': true,
    'reconnection delay': 50,
    'max reconnection attempts': 300
});


window.ondevicemotion = function(e){
    c.x = Math.round(e.accelerationIncludingGravity.x * factor)/ factor;
    c.y = Math.round(e.accelerationIncludingGravity.y* factor)/ factor;
    c.z = Math.round(e.accelerationIncludingGravity.z* factor)/ factor;
    document.getElementById("accelerationX").innerHTML = " " + c.x;
    document.getElementById("accelerationY").innerHTML = " " + c.y;
    document.getElementById("accelerationZ").innerHTML = " " + c.z;
    collectedInfo = {x: c.x, y: c.y, z: c.z};
    // send data over the socket
    if (lastInfo.x !== collectedInfo.x || lastInfo.y !== collectedInfo.y || lastInfo.z !== collectedInfo.z){
//            console.log(JSON.stringify(collectedInfo) + " = " + JSON.stringify(lastInfo));
        lastInfo = collectedInfo;  // memorize
        emitInfo = {payload: lastInfo};

        emitInfo.type = "accelerometer";
        emitInfo.device = sessionId;
        emitInfo.timestamp = new Date();

        if (stalling) {
            console.log("stalling");
            stalled += 1;
            stalledMessages.push(emitInfo);
            if(stalled >= stall){
                stalling = false;
                document.getElementById("stalling").innerHTML = "emitting stalled";
                document.getElementById("stalling").className = "btn btn-lg warning col-xs-12 bg-info";
                while (stalledMessages.length > 0) {
                    socket.emit('acceleration', stalledMessages.shift());
                    console.log("emitting stalled");
                }
                document.getElementById("stalling").innerHTML = "emitting live";
                document.getElementById("stalling").className = "btn btn-lg warning col-xs-12 bg-success";
            }  // stop stalling now: emit at once

        } else {
            socket.emit('acceleration', emitInfo);
            console.log("emitting live");
            stalling = Math.random() < 0.00;
            if (stalling) {
                console.log("started stalling");
                stalled = 0;
                document.getElementById("stalling").innerHTML = "stalling";
                document.getElementById("stalling").className = "btn btn-lg warning col-xs-12 bg-warning";
            }
        }
    }

};