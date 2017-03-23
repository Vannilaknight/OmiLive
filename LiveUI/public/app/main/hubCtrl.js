angular.module('app').controller('hubCtrl', function ($scope, $http) {
    var socket = io.connect('http://localhost:3029');

    $scope.activeWebservice = 'service';
    $scope.getWebservice = function (webservice) {
        if(webservice === $scope.activeWebservice){
            return 'active';
        }
    };

    $scope.activeCom = 'batchWeb';
    $scope.getCom = function (com) {
        if(com === $scope.activeCom){
            return 'active';
        }
    };

    $scope.activeTimer = 'com';
    $scope.getTimers = function (timer) {
        if(timer === $scope.activeTimer){
            return 'active';
        }
    };

    $scope.activeMemory = 'basic';
    $scope.getMemory = function (memory) {
        if(memory === $scope.activeMemory){
            return 'active';
        }
    };

    $scope.activeTab = 'memory';
    $scope.getTab = function (tab) {
        if(tab === $scope.activeTab){
            return 'active';
        }
    };

    $scope.getData = function () {
        $http.get('/start').then(function (data) {
            console.log(data)
        });
    };

    socket.on('metrics', function (data) {
        console.log(data);
        $scope.$apply(function () {
            $scope.metrics = data;
            console.log($scope.metrics);
        });
    });
});
