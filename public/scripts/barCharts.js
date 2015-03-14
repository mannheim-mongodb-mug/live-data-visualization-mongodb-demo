var n = 59;
var random = d3.random.normal(0, 10);
var data = d3.range(n).map(random);
data.unshift(-30);
data.push(30);

var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");


var barX = d3.select("#dataX").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barY = d3.select("#dataY").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

makeBarCharts = function (bar, data) {
    x.domain(d3.extent(data, function (d) {
        return d;
    })).nice();
    y.domain(data.map(function (d) {
        return d;
    }));

    bar.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    bar.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", height);


    bar.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function (d) {
            return d < 0 ? "bar negative" : "bar positive";
        })
        .attr("x", function (d) {
            return x(Math.min(0, d));
        })
        .attr("y", function (d) {
            return y(d);
        })
        .attr("width", function (d) {
            return Math.abs(x(d) - x(0));
        })
        .attr("height", y.rangeBand());
        //.style("fill", "steelblue");
};

makeBarCharts(barX, data);

function type(d) {
    d = +d;
    return d;
}

function tick(value) {
    //console.log(value);
    data.push(value.x + value.y + value.z);
    data.shift();
    barX.selectAll(".bar")
        .data(data)
        .transition()
        .duration(0)
        .attr("class", function (d) {
            return d < 0 ? "bar negative" : "bar positive";
        })
        .attr("x", function (d) {
            return x(Math.min(0, d));
        })
        .attr("y", function (d, i) {
            return i * height / data.length;
        })
        .attr("width", function (d) {
            return Math.abs(x(d) - x(0));
        })
        .attr("height", y.rangeBand());

    //console.log(data);
};
