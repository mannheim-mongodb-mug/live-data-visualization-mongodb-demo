
schema = {
  _id: "objectID",
    // ObjectId assigned by database
    timestamp: "2014-12-17T21:11:23.148Z",
    // timestamp of device of recorded data.
    device: "PSP5517DUO",
    // device id
    type: "location",
    // type of sensor data ( accelerometer | location | ... )
  // actual sensor data.
  payload: {
    version: {
      x: 0.228,
      y: 0.57,
      z: 9.007999999999999
    },
    loc: {
      type: "Point",
      coordinates: [
        0,
        // latitude
        0
        // longitude
      ]
    }
  }
};

indexes= [
    {
        // multikey index to assure uniqueness of data (if device sends data more than once while syncing)
        assertUnique: [timestamp, device, type], sort: -1
    },
    {
        // index devices
        device: 1
    },
    {
        // index devices
        type: 1
    }
];
