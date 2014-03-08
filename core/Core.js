var Promise = require("promise");
var request = require("request");
var Enumerable = require("linq");
var xml2json = require('xml2json');

if(!String.format)
    String.format = function(){
        for (var i = 0, args = arguments; i < args.length - 1; i++)
            args[0] = args[0].replace(RegExp("\\{" + i + "\\}", "gm"), args[i + 1]);
        return args[0];
    };
if(!String.prototype.format && String.format)
    String.prototype.format = function(){
        var args = Array.prototype.slice.call(arguments).reverse();
        args.push(this);
        return String.format.apply(this, args.reverse())
    }

exports.fetchXmlList = function() {
    var response = Q.defer();
    http.get(url, function(res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('error', function(e) {
            response.reject(e);
        })

        res.on('end', function () {
            response.resolve(str);
        });
    });
    return response.promise;
}


exports.parseXml = function (xmlStr) {
    var response = Q.defer();
    var obj = xml2json.toJson(xmlStr, { object: true });
    response.resolve(obj);

    return response.promise;
};

Enumerable.prototype.stdDev = function(selector) {
    var values = this;
    var ret = 0;
    var count = values.count(selector);
    if (count  > 1)
    {
        //Compute the Average
        var avg = values.average(selector);

        //Perform the Sum of (value-avg)^2
        var sum = values.select(selector).sum(function(d) {
            return (d - avg) * (d - avg)
        });

        //Put it all together
        ret = Math.sqrt(sum / count);
    }
    return ret;
}

exports.request = function requestp(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            resolve(JSON.parse(body));
        });
    });
};


exports.xmlToJson = function(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}