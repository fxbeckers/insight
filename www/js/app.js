// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'geolocation'])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // the pet tab has its own child nav-view and history
    .state('tab.location', {
      url: '/location',
      views: {
        'location-tab': {
          templateUrl: 'templates/location.html',
          controller: 'LocationCtrl'
        }
      }
    })

    .state('tab.location-result', {
      url: '/location/:lat/:lng',
      views: {
        'location-tab': {
          templateUrl: 'templates/location-result.html',
          controller: 'LocationResultCtrl'
        }
      }
    })

  .state('tab.location-stats-summary', {
      url: '/location/:lat/:lng/summary/:idx',
      views: {
          'location-tab': {
              templateUrl: 'templates/location-stats-summary.html',
              controller: 'LocationStatsSummaryCtrl'
          }
      }
  })

      .state('tab.location-stats-detail', {
          url: '/location/:lat/:lng/detail/:idx',
          views: {
              'location-tab': {
                  templateUrl: 'templates/location-stats-detail.html',
                  controller: 'LocationStatsDetailCtrl'
              }
          }
      })

    .state('tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/location');

})
.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

