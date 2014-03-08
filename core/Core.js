var Promise = require("promise");
var request = require("request");
var Enumerable = require("linq");

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