var core = require("../core/Core");

var Enumerable = require('linq');

var baseUrl = 'http://api.ratings.food.gov.uk';

var getRestaurants = function (geo) {
    var url = String.format(baseUrl + "/Establishments?latitude={0}&longitude={1}&maxDistanceLimit={2}", geo.lat, geo.lng,1);

    var options = {
        url: url,
        headers: {
            'x-api-version': '2'
        }
    };

    return core.request(options).then(function (data) {
        return Enumerable.from(data.establishments)
            .select(function (item) {
                item.Distance  = item.Distance*1000;
                return item;
            })
            .toArray();
    });
}


var getData = function(geo) {
    return getRestaurants(geo).then(function(data){
        return Enumerable.from(data)
            .where(function(item) {
                return item.RatingValue != 'AwaitingInspection' && item.RatingValue != 'Exempt';
            })
            .select(function(item) {
                item.PerformanceMetric = parseInt(item.RatingValue);
                return item;
            })
            .toArray();
    })
}

exports.getData = getData;

