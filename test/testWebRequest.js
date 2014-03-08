var Enumerable = require('linq');
var food = require("../api/Food");

var clapham = { lat: 51.46439, lng: -0.13271};
var pimlico = { lat: 51.48906, lng: -0.13803};

food.getData(pimlico).then(function(data) {
    var close = Enumerable.from(data)
        .count('$.Distance<100');

    var further = Enumerable.from(data)
        .count('$.Distance<500');

    var average = Enumerable.from(data)
        .average('$.PerformanceMetric');

    var stdDev = Enumerable.from(data)
        .stdDev('$.PerformanceMetric');

    var ratings = Enumerable.from(data)
        .distinct('$.PerformanceMetric')
        .select('$.PerformanceMetric')
        .toArray();

    debugger;
});