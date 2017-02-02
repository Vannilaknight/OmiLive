angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'ngCookies'])
  .config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/partials/main/hub',
        controller: 'hubCtrl'
      })
  })
  .run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
      if (rejection === 'not authorized') {
        $location.path('/login');
      }
    })
  });
