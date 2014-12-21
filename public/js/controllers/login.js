app.controller('loginCtrl', ['$scope', '$rootScope', 'scopeApply', '$location', function ($scope, $rootScope, scopeApply, $location) {

    $scope.isLogging = false;
    $scope.user = {};
    //Your code here.

    $scope.login_socket = function (data) {
        scopeApply.apply($scope, function () {
            if (data.message === true)
                $scope.correctLoginOrCreate();
            else {
                $scope.message = data.message;
                $scope.isLogging = false;
            }
        })
    };
    $scope.create_socket = function (data) {
        scopeApply.apply($scope, function () {
            if (data.message === true)
                $scope.correctLoginOrCreate();
            else {
                $scope.message = data.message;
                $scope.isLogging = false;
            }
        })
    };
    $scope.correctLoginOrCreate = function () {
        window.location.href = window.location.origin;
    };

    $scope.login = function () {
        if ($scope.user.name != '' && $scope.user.password != '') {
            //proceed
            $scope.isLogging = true;
            $rootScope.app.io.ngEmit('user:login', $scope.user);
        }
    };
    $scope.newUser = function () {
        if ($scope.user.name != '' &&
            $scope.user.password != '' &&
            $scope.user.passwordRe == $scope.user.password) {
            //proceed
            $scope.isLogging = true;
            var send = angular.copy($scope.user);
            delete send.passwordRe;
            $rootScope.app.io.ngEmit('user:create', send);
        }
    };

    $rootScope.app.io.on('user:create', $scope.create_socket);
    $rootScope.app.io.on('user:login', $scope.login_socket);

    $scope.$on('$destroy', function (event) {
        $rootScope.app.io.off('user:create', $scope.create_socket);
        $rootScope.app.io.off('user:login', $scope.login_socket);
    });

}]);