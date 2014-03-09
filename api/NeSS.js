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
    var url = String.format(baseUrl + "/Deli/getTables?Areas={0}&Datasets=2062,2212&GroupByDataset=Yes", areasCsv);

    return core.request(url).then(function(xml){
        return core.parseXml(xml);
    });
}

exports.getAreas = function(postcode) {
    var url = String.format(baseUrl + "/Disco/FindAreas?Postcode={0}",postcode);

    debugger;
    return core.request(url).then(function(xml){
        return core.parseXml(xml);
    }).then(function(areas){
        var areaFallsWithin = areas["ns2:FindAreasResponseElement"].AreaFallsWithins.AreaFallsWithin;


        debugger;
        var areasOfInterest = Enumerable.from(areaFallsWithin)
            .select("$.Area")
            .where(function(area){
                return [15, 141, 140, 13, 11].indexOf(area.LevelTypeId) != -1;
            })
            .toArray();

        return areasOfInterest;
    });
}

var parseDatasets = function (datasets){
    /*
     2575=Ethnicity (2011 Census)
     2062(Topic=7903)=New Biz
     2212(TopidID=8559)=Unemployment Rate
     */
    debugger;

    var data = datasets["ns2:getDataCubeResponseElement.ns3:Datasets"];

    var datasetDetails = Enumerable.from(data)
        .select("$.DatasetDetails")
        .toArray();

    return datasetDetails;
}

exports.getData = function(geo) {
    /* get post code from geo (lat lng) */
    debugger;
    return gm.getPostcode(geo.lat + "," + geo.lng).then(function(postCode){
        return exports.getAreas(postCode);
    }).then(function(areas) {
        var areasCsv = Enumerable.from(areas)
            .select('$.AreaId')
            .toArray()
            .join();
        return getNeSSDatasets(areasCsv);
    }).then(function(datasets){
       return parseDatasets(datasets);
    });
}
