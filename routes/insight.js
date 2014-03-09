
/*
 * GET users listing.
 */

exports.insight = function(req, res){
    var url_parts = urlLib.parse(req.url, true);
    var query = url_parts.query;
    if (!query.from || !query.to) {
        res.send('You\'re missing params chump!  The urlLib needs a from and to in the query string, e.g. ?=from=fromAddress&to=toAddress');
    } else {
        gmaps.getRouteCoordinatesArray(query.from,query.to)
            .then(function(coords) {
                var promises = Enumerable.from(coords)
                    .select(function(coord) {
                        return jamcam.getClosestCamera(coord.lat,coord.lng);
                    })
                    .toArray();
                return Q.all(promises);
            })
            .then(function(item) {
                var distinctCameras =  Enumerable.from(item)
                    .distinct(function(cameraPt) {
                        return cameraPt.camera.id;
                    }).toArray();
                res.send(distinctCameras);
            })
            .fail(function(err) {
                console.error(err);
            });
    }
  res.send("respond with a resource");
};