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

    return core.requestJson(options).then(function (data) {
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
                item.Rating = parseInt(item.RatingValue);
                return item;
            })
            .toArray();
    }).then(function(data){
        var groupDefinitions = [
            { idx: 0, distance: 30,  description: 'your location (~30m)' },
            { idx: 1, distance: 100, description: 'your immediate vicinity (~100m)' },
            { idx: 2, distance: 300, description: 'this neighbourhood (~300m)' },
            { idx: 3, distance: 500, description: 'the local area (~500m)' },
            { idx: 4, distance: 1000, description: 'the wider area (~1km)' },
        ]

        var groupz = Enumerable.from(groupDefinitions)
            .select(function(groupDefinition){
                var itemsInGroup = Enumerable.from(data)
                    .where(function(item) {
                        return item.Distance < groupDefinition.distance;
                    })
                    .toArray();
                    var itemsInGroupEnum = Enumerable.from(itemsInGroup)
                    var avgRating = itemsInGroupEnum.average('$.Rating');
                    var count = itemsInGroupEnum.count();
                return {
                    definition : groupDefinition,
                    count : count,
                    items : itemsInGroup,

                    // Generic
                    description: groupDefinition.description,
                    value : avgRating
                }
            }).toArray();

         //var stdDev = data.stdDev('$.Rating');
         //var avgAll = data.average('$.Rating');

        return {
            datasetName : 'Food safety rating',
            formatter : 'average food safety rating',
            groups : groupz,
            threshold : 0.1
        }
    })
}

exports.getData = getData;

