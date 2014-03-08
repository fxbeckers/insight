var core = require("../core/Core");
var Enumerable = require('linq');
var gm = require('googlemaps');

gm.config('key', 'AIzaSyA61x2SVgLTCQoYv1vSqs_vjU7yarKUasQ');

var getPostCode = function (geo) {
    gm.reverseGeocode('41.850033,-87.6500523', function(err, data){
        util.puts(JSON.stringify(data));
    });
};
