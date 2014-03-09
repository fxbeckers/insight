var gm = require('../api/gmaps');
var ness = require('../api/NeSS');
var core = require('../core/Core');



//gm.getPostcode('51.46439,-0.13271').then(function(resp){
//    return ness.getAreas(resp);
//}).then(function(resp){
//
//}).then(function(xmlJson){
//
//}).then(function(xmlJson){
//    console.log(xmlJson);
//    debugger;
//})
//.catch(function(err){
//    debugger;
//})


ness.getData('51.46439,-0.13271').then(function(data){
    console.log(data);
    var items = data["ns2:getDataCubeResponseElement"]["ns3:Datasets"]["ns3:Dataset"]["ns3:DatasetItems"];
    debugger;
})
.catch(function(err){
    debugger;
})
