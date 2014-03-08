var core = require("../core/Core");
var Enumerable = require('linq');
var request = require("request");

var baseUrl = 'http://neighbourhood.statistics.gov.uk/NDE2';

var getNeSSDatasets = function (areas) {
    /*
        2575=Ethnicity (2011 Census)
        2062(Topic=7903)=New Biz
        2212(TopidID=8559)=Unemployment Rate
    */
    var url = String.format(baseUrl + "/Deli/getTables?Areas={0}&Datasets=2575,2062,2212&GroupByDataset=Yes", areas);

    var options = {
        url: url
    };

    return request(url, function (err, res, body) {
        if (err) {
            return reject(err);
        } else if (res.statusCode !== 200) {
            err = new Error("Unexpected status code: " + res.statusCode);
            err.res = res;
            return reject(err);
        }
    });

}

var getAreas = function(postcode) {
    var url = String.format(baseUrl + "/Disco/FindAreas?Postcode={0}",postcode);

    return request(url, function (err, res, body) {
        if (err) {
            return reject(err);
        } else if (res.statusCode !== 200) {
            err = new Error("Unexpected status code: " + res.statusCode);
            err.res = res;
            return reject(err);
        }
    });
}

exports.getData = function(geo) {
    /* get post code from geo (lat lng) */
    var postcode = 'SW46EL';

    /* get relevant areas from postcode */
    var areas = getAreas(postcode);

    return getEthnicityData(geo).then(function(data){
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
