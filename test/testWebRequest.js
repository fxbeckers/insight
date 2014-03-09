var Enumerable = require('linq');
var insightEngine = require("../api/InsightEngine");

var clapham = { lat: 51.4644174, lng: -0.1325597};
var claphamNorth = { lat: 51.4672527, lng: -0.1277075};
var pimlico = { lat: 51.48906, lng: -0.13803};

insightEngine.garnerInsights(pimlico).then(function(data) {
    debugger;
}).catch(function(err) {
    console.error(err);
    debugger;
});