// just some helpers
// review sample data via aggregation in shell

db.rawData.aggregate([
    {
        $project: {
            seconds: {$second: "$timestamp"},
            x: "$payload.x",
            y: "$payload.y",
            z: "$payload.z"
        }
    },
    {
        $group: {_id: "$seconds",
            x: {$avg: "$x"},
            y: {$avg: "$y"},
            z: {$avg: "$z"},
            count: {$sum: 1}
        }
    },
    {$sort: {_id: 1}}
]).forEach(printjson);



db.rawData.aggregate([
    {
        $project: {
            day: {$dayOfYear: "$timestamp"},
            hour: {$hour: "$timestamp"},
            payload: "$payload"
        }
    },
    {
        $group: {_id: {day: "$day", hour: "$hour"},
            x: {$avg: "$payload.x"},
            y: {$avg: "$payload.y"},
            z: {$avg: "$payload.z"},
            count: {$sum: 1}
        }
    },
    {$sort: {_id: 1}}
]).forEach(printjson);




db.rawData.aggregate([
    {
        $project: {
            day: {$dayOfYear: "$timestamp"},
            hour: {$hour: "$timestamp"},
            payload: "$payload"
        }
    },
    {
        $group: {_id: {day: "$day", hour: "$hour"},
            min: {$min: "$payload.x"},
            max: {$max: "$payload.x"},
            count: {$sum: 1}
        }
    },
    {$sort: {_id: 1}}
]).forEach(printjson);


db.rawData.aggregate([
    {
        $project: {
            day: {$dayOfYear: "$timestamp"},
            hour: {$hour: "$timestamp"},
        }
    },
    {
        $group: {_id: {day: "$day", hour: "$hour"},
            count: {$sum: 1}
        }
    },
    {$sort: {_id: 1}}
]).forEach(printjson);