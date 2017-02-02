angular.module('app').controller('hubCtrl', function ($scope, $http) {
    var socket = io.connect('http://localhost:3029');
    $scope.getData = function () {
        $http.get('/data').then(function (data) {
            console.log(data)
        });
    };

    socket.on('freshDataOne', function (data) {
        console.log(data);
        $scope.$apply(function () {
            $scope.dataOne = data;
        });
    });

    socket.on('freshDataTwo', function (data) {
        console.log(data);
        $scope.$apply(function () {
            $scope.dataTwo = data;
        });
    });
});
