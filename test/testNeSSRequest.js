var ness = require("../api/NeSS");

var claphamNorth = { lat: 51.4672527, lng: -0.1277075};
var pimlico = { lat: 51.48906, lng: -0.13803};

ness.getData(claphamNorth).then(function(data) {
    debugger;
}).catch(function(err) {
        debugger;
    });
