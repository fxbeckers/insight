angular.module('starter.services', [])

.factory('InsightService', function($http) {
  return {

    lookup: function(query) {
      return $http.get('http://localhost:3000/query', {
          params : { q : query }
      });
    },
    insight: function(coord) {
      return $http.get('http://localhost:3000/insight/'+coord.lat+'/'+coord.lng);
    }
  }
})

.factory('CacheService', function($http) {
    var dict = {};
    return {
        get : function(lat, lng) {
            if (!!lat && !! lng && !!dict[lat] && !!dict[lat][lng])
                return dict[lat][lng];
            else
                return null;
        },

        set : function(lat, lng, item) {
            if (!(!!lat && !! lng && !!item))
                throw new Error('input params');
            if (!dict[lat]) {
                dict[lat]  = {};
            }

            if (!dict[lat][lng]) {
                dict[lat][lng]  = {};
            }
            dict[lat][lng] = item;
        }
    }
});;
