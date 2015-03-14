var cockpitOnDemand = io.connect('http://localhost:3000/cockpitOnDemand');
cockpitOnDemand.emit('cockpit', 'hello');
cockpitOnDemand.on('message', function(data){
    console.log(data);
    tick(data);
});