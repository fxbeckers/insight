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

    return core.request(url).then(function(xml){
        return core.parseXml(xml);
    }).then(function(areas){
        var areaFallsWithin = areas["ns2:FindAreasResponseElement"].AreaFallsWithins.AreaFallsWithin;


        var areasOfInterest = Enumerable.from(areaFallsWithin)
            .select("$.Area")
            .where(function(area){
                return [15, 141, 140, 13, 11, 10].indexOf(area.LevelTypeId) != -1;
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

    var dataset = datasets["ns2:getDataCubeResponseElement"]["ns3:Datasets"]["ns3:Dataset"];

    var topicCodeToTopicIdMapping = {
        2212 : 8559,
        2062 : 7903
    }

    var datasetDetails = Enumerable.from(dataset)
        .select(function(item) {
            var datasetCode = item['ns3:DatasetDetails']['ns3:DatasetCode'];
            var topicCode = topicCodeToTopicIdMapping[datasetCode];
            var topic  = Enumerable.from(item['ns3:Topics']['ns3:Topic'])
                .single(function(i){
                    return i['ns3:TopicCode'] == topicCode;
                });
            var topicId = topic['ns3:TopicId'];


            var datasetItem = item['ns3:DatasetItems']['ns3:DatasetItem'];
            var ds = Enumerable.from(datasetItem)
                .where(function(dsi) {
                    return dsi['ns3:TopicId'] == topicId;
                })
                .toArray();
            return ds;
        })
        .toArray()[0];

        var obj = Enumerable.from(datasetDetails)
            .toObject(function(i) {
                return i['ns3:BoundaryId'];
            }, function(i) {
                return i['ns3:Value'];
            })

    return obj;
}

exports.getData = function(geo) {
    /* get post code from geo (lat lng) */
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
    }).then(function(kvp){
            var groupDefinitions = {
                1: { boundaryId: 1, description: 'your immediate vicinity' },
                2: { boundaryId: 2, description: 'this neighbourhood' },
                3: { boundaryId: 3, description: 'this local area' },
                4: { boundaryId: 4, description: 'this council' },
                5: { boundaryId: 5, description: 'the city' },
                6: { boundaryId: 6, description: 'the region' },
                7: { boundaryId: 7, description: 'the country' }
            }

            var keys = Object.getOwnPropertyNames(kvp)
            var gps = Enumerable.from(keys)
                .select(function(key) {
                    var val = kvp[key];
                    var def = groupDefinitions[key];
                    return {
                        idx : def.boundaryId,
                        key : key,
                        value : val,
                        description :def.description
                    }
                })
                .toArray();

            var nearestStat = Enumerable.from(gps).first();
            return {
                datasetName : 'Unemployment rate',
                formatter : 'unemployment rate',
                groups : gps,
                threshold : 0.15,
                detailList : [{
                    key : nearestStat.description,
                    val : Math.round(nearestStat.value*10)/10 + '&#37;'
                }]
            }
    });
}
