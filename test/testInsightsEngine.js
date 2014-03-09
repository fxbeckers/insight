var engine = require('../api/InsightEngine');

var testData = {
    datasetName : 'Food safety rating',
    formatter : 'average food safety rating',
    groups : [
        { idx: 0, description: 'your location (~50m)' , value : 3.2},
        { idx: 1, description: 'your immediate vicinity (~100m)', value : 3.7},
        { idx: 2, description: 'this neighbourhood (~300m)', value : 3.9},
        { idx: 3, description: 'the local area (~500m)', value : 3.0},
        { idx: 4, description: 'the wider area (~1km)', value : 3.2},
    ],
    threshold : 0.1
}

var insights = engine.garnerInsights(testData).then(function(datasets) {
    debugger
}).catch(function(err) {
    console.error(err);
});