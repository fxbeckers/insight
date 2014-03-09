var express = require('express');
var gm = require('./api/gmaps');

var urlLib = require('url');
var http = require('http');
var path = require('path');

var insightEngine = require('./api/InsightEngine');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/query', function(req, res){
    var url_parts = urlLib.parse(req.url, true);

    var query = url_parts.query.q;

    if (!query) {
        res.send('Missing query');
    } else {
        gm.geoCode(query).then(function(loc) {
            res.send(loc);
        })
    }
});
app.get('/insight/:lat/:lng', function(req, res){
    var lat = parseFloat(req.params.lat);
    var lng = parseFloat(req.params.lng);

    if (!lat || !lng) {
        res.send('Missing query');
    } else {
        var coord = {
            lat : lat,
            lng : lng
        }
        insightEngine.garnerAllInsights(coord).then(function(insights) {
            res.send({
                coord : coord,
                metrics : insights
            });
        }).catch(function(err) {
            res.send({
                error : err
            });
        });
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
