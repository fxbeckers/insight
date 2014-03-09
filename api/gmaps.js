var core = require("../core/Core");
var Q = require('q');
var Enumerable = require('linq');
var gm = require('googlemaps');

gm.config('key', 'AIzaSyA61x2SVgLTCQoYv1vSqs_vjU7yarKUasQ');

exports.geoCode = function (geo) {
    var response = Q.defer();
    gm.geocode(geo, function(err, data){
        if (err)
            response.reject(err);
        else
            response.resolve(data);
    });
    return response.promise.then(function(data) {
        return data.results[0].geometry.location;
    });
};

exports.reverseGeocode = function (geo) {
    var response = Q.defer();
    gm.reverseGeocode(geo, function(err, data){
        if (err)
            response.reject(err);
        else
            response.resolve(data);
    });
    return response.promise;
};

exports.getPostcode = function (geo) {
    return exports.reverseGeocode(geo).then(function(data){
        var sn = Enumerable.from(data.results)
            .selectMany('$.address_components')
            .first(function(item){
                return Enumerable.from(item.types).contains('postal_code') && item.long_name.length>6;
            }).long_name;
        return sn.replace(/\s+/gi,'');
    });
};
