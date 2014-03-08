var gm = require('googlemaps');
gm.config('key', 'AIzaSyA61x2SVgLTCQoYv1vSqs_vjU7yarKUasQ');


gm.geocode('SW1v 2NS London', function(err, data){
    console.log(JSON.stringify(data));
});

gm.geocode('51.46439,-0.13271', function(err, data){
    console.log(JSON.stringify(data));
});
