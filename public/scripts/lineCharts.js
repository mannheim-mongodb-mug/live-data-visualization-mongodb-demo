var n = 60;
var random = d3.random.normal(0, 10);
var dataX = d3.range(n).map(random);
var dataY = d3.range(n).map(random);
var dataZ = d3.range(n).map(random);

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([-50, 50])
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
var pathX = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(dataX)
    .attr("class", "line")
    .style("stroke", "green")
    .style("stroke-width", "3")
    .attr("d", line);
var pathY = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(dataY)
    .attr("class", "line")
    .style("stroke", "red")
    .style("stroke-width", "3")
    .attr("d", line);
var pathZ = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(dataZ)
    .attr("class", "line")
    .style("stroke", "blue")
    .style("stroke-width", "3")
    .attr("d", line);
//tick();
function tick(value) {
    // push a new data point onto the back
    dataX.push(value.x);
    // redraw the line, and slide it to the left
    pathX
        .attr("d", line)
        .attr("transform", null)
        .transition()
        //.duration(250)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)");
    //.each("end", tick);
    // pop the old data point off the front
    //dataX.shift();
    // push a new data point onto the back
    dataY.push(value.y);
    // redraw the line, and slide it to the left
    pathY
        .attr("d", line)
        .attr("transform", null)
        .transition()
        .duration(250)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)");
    //.each("end", tick);
    // pop the old data point off the front
    //dataY.shift();
    // push a new data point onto the back
    dataZ.push(value.z);
    // redraw the line, and slide it to the left
    pathZ
        .attr("d", line)
        .attr("transform", null)
        .transition()
        .duration(250)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)");
    //.each("end", tick);
    // pop the old data point off the front
    dataX.shift();
    dataY.shift();
    dataZ.shift();
}
