app.controller('logoutCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {


    $scope.logout = function () {
        window.location.href = window.location.origin;
    };

    $rootScope.app.io.on('logout', $scope.logout);

    $scope.$on('$destroy', function (event) {
        $rootScope.app.io.off('logout', $scope.logout);
    });

    $rootScope.app.io.emit('logout');

}]);