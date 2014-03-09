angular.module('starter.controllers', [])

.controller('LocationCtrl', function($scope, InsightService, geolocation, $ionicLoading, $state, $rootScope) {

        $rootScope.metrics = null;
        var showLoading = function() {
        // Show the loading overlay and text
        $scope.loading = $ionicLoading.show({

            // The text to display in the loading indicator
            content: 'Loading',

            // The animation to use
            animation: 'fade-in',

            // Will a dark overlay or backdrop cover the entire view
            showBackdrop: true,

            // The maximum width of the loading indicator
            // Text will be wrapped if longer than maxWidth
            maxWidth: 200,

            // The delay in showing the indicator
            showDelay: 0
        });
    };

    // Hide the loading indicator
    var hideLoading = function(){
        $scope.loading.hide();
    };

  $scope.search = function(queryText) {
      showLoading();

      InsightService.lookup(queryText).then(function(xhr){
          var data = xhr.data;
          $state.go("tab.location-result", data);
          hideLoading();
      }).catch(function(err) {
          hideLoading();
          alert('Error: '+err);
      });
  }

    $scope.findMe = function() {
        showLoading();
        geolocation.getLocation().then(function(data){
            $state.go("tab.location-result", {lat:data.coords.latitude, lng:data.coords.longitude});
            hideLoading();
        }).catch(function(err) {
            hideLoading();
                alert(JSON.stringify(err));
        });
    }
})

.controller('LocationResultCtrl', function($scope, $stateParams, InsightService, $rootScope) {
        $scope.lat = $stateParams.lat;
        $scope.lng = $stateParams.lng;
        function loadInsight () {
            $scope.loading = true;
                InsightService.insight({lat : $scope.lat, lng : $scope.lng}).then(function(item){
                    return item.data;
                }).then(function(insight){
                        $scope.metrics = insight.metrics;
                        $rootScope.metrics = insight.metrics;
                        $scope.loading = false;
                    }).catch(function(err) {
                        $scope.loading = false;
                })
        }
        if (!$rootScope.metrics) {
            loadInsight();
        }

        $scope.share =function () {
            alert("You haven't implemented me, chump!");
        }

})

.controller('LocationStatsSummaryCtrl', function($scope, $rootScope, $state, $stateParams) {
    $scope.lat = $stateParams.lat;
    $scope.lng = $stateParams.lng;
    $scope.idx = parseInt($stateParams.idx);

    $scope.data = $rootScope.metrics[$scope.idx];
})

.controller('LocationStatsDetailCtrl', function($scope, $rootScope, $state, $stateParams) {
    $scope.lat = $stateParams.lat;
    $scope.lng = $stateParams.lng;
    $scope.idx = parseInt($stateParams.idx);

    $scope.data = $rootScope.metrics[$scope.idx];
});
