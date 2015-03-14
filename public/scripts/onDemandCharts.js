function tick(data) {
    d3.select("#data").html("");

    var dataX = [],
        dataY = [],
        dataZ = [],
        cnt = 0;
    for (var i = 0; i < data.length; i++ ) {
        dataX.push(data[i].x);
        dataY.push(data[i].y);
        dataZ.push(data[i].z);
        cnt += data[i].count;
    }
    d3.select("#counted").text(parseInt(cnt).toLocaleString('de-DE'));
    var allvalues = dataX.concat(dataY).concat(dataZ);
    allvalues.push(0);

    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var x = d3.scale.linear()
        .domain([0, dataX.length - 1])
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([d3.min(allvalues, function(d){return d}), d3.max(allvalues, function(d){return d})])
        .range([height, 0]);
    var line = d3.svg.line()
        .x(function (d, i) {
            return x(i);
        })
        .y(function (d, i) {
            return y(d);
        });
    var svg = d3.select("#data").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(dataX)
        .attr("class", "line")
        .style("stroke", "lime")
        .style("stroke-width", "3")
        .attr("d", line);
    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(dataY)
        .attr("class", "line")
        .style("stroke", "red")
        .style("stroke-width", "3")
        .attr("d", line);
    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(dataZ)
        .attr("class", "line")
        .style("stroke", "blue")
        .style("stroke-width", "3")
        .attr("d", line);
}