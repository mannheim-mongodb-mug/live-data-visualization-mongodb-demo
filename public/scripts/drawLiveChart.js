var cockpit = io.connect('http://localhost:3000/cockpit');
cockpit.emit('cockpit', 'hello');
var count = 0;
cockpit.on('message', function (data) {
    count++;
    document.getElementById('counted').innerHTML = count;
    tick(data.payload);
});