var food = require("./Food");
var ness = require("./NeSS");
var Q = require("q");
var Enumerable = require("linq");

// All datasets here
var datasetGetters = [food.getData, ness.getData];

function cleanup (data) {
    data.groups = Enumerable.from(data.groups)
        .where(function(item) {
            return typeof item.value !== 'undefined' && item.value !== null && !isNaN(item.value)
        })
        .toArray();
    return data;
}

// http://www.thefreedictionary.com/garner
function garnerInsights(data) {
    var groups = data.groups;
    var threshold = data.threshold;

    var breaches = [];

    function insightRecurse(grps) {
        if (grps.length<2) return;

        var i = 0;
        var current = grps[0];

        while(i<grps.length-1) {
            var nxt = grps[i+1];

            var pctChange = 1 - (nxt.value/current.value);

            if (Math.abs(pctChange) >= threshold) {
                breaches.push({
                    current : current,
                    other : nxt,
                    pctChange : pctChange
                })
            }
            i++;
        }

        // If we have enough items to continue, do so
        var gps = grps.slice(1);
        insightRecurse(gps);
    }

    insightRecurse(groups);

    var j = 0;
    var indexedItems = Enumerable.from(breaches)
        .select(function(item) {
            item.idx = j;
            j++;
            return item;
        })
        .toArray();

    var first = Enumerable.from(indexedItems).where("$.pctChange>0").take(1);
    var second = Enumerable.from(indexedItems).where("$.pctChange<0").take(1);
    var valuableInsights = Enumerable.from(first)
        .union(second)
        .orderBy('$.idx')
        .toArray();

    return valuableInsights;
}

function getHumanReadableInsights (data) {
    var cleanedUpData = cleanup(data);
    var machineInsights = garnerInsights(cleanedUpData);

    return Enumerable.from(machineInsights)
        .select(function(item) {
            return String.format('The {0} in {1} is {2}, which is {3}% {4} than that of {5} at {6}',
                data.formatter,
                item.current.description,
                Math.round(Math.abs(item.current.value)*10)/10,
                Math.round(Math.abs(item.pctChange)*1000)/10,
                (item.pctChange > 0)?'more' : 'less',
                item.other.description,
                Math.round(Math.abs(item.other.value)*10)/10
            )
        })
        .toArray();
}

function getAllDatasets (geo) {
    var promises =  Enumerable.from(datasetGetters)
        .select(function(getter){
            return getter(geo).then(function(statsSummary) {
                return {
                    insights : getHumanReadableInsights(statsSummary),
                    summary : statsSummary
                }
            });
        })
        .toArray();

    return Q.all(promises);
}

exports.garnerAllInsights = getAllDatasets;

