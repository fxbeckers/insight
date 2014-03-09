var core = require("../core/Core");
var Enumerable = require('linq');
var gm = require('./gmaps');

var baseUrl = 'http://neighbourhood.statistics.gov.uk/NDE2';

var getNeSSDatasets = function (areasCsv) {
    /*
        2575=Ethnicity (2011 Census)
        2062(Topic=7903)=New Biz
        2212(TopidID=8559)=Unemployment Rate
    */
    var url = String.format(baseUrl + "/Deli/getTables?Areas={0}&Datasets=2575,2062,2212&GroupByDataset=Yes", areasCsv);

    return core.request(url).then(function(xml){
        return core.parseXml(xml);
    });
}

exports.getAreas = function(postcode) {
    var url = String.format(baseUrl + "/Disco/FindAreas?Postcode={0}",postcode);

    return core.request(url).then(function(xml){
        return core.parseXml(xml);
    }).then(function(areas){
        var areaFallsWithin = areas["ns2:FindAreasResponseElement"].AreaFallsWithins.AreaFallsWithin;

        var areasOfInterest = Enumerable.from(areaFallsWithin)
            .select("$.Area")
            .where(function(area){
                return [15, 141, 140, 13, 11].indexOf(area.LevelTypeId) != -1;
            })
            .toArray();

        return areasOfInterest;
    });
}

exports.getData = function(latLng) {
    /* get post code from geo (lat lng) */
    return gm.getPostcode(latLng).then(function(postCode){
        return exports.getAreas(postCode);
    }).then(function(areas) {
        var areasCsv = Enumerable.from(areas)
            .select('$.AreaId')
            .toArray()
            .join();
        return getNeSSDatasets(areasCsv);
    }).then(function(items){
       debugger;
       return items;
    });
}
