app.controller('albumsCtrl', ['$scope', '$rootScope', 'scopeApply', function ($scope, $rootScope, scopeApply) {

    //Your code here.
    $scope.isLoading = true;
    $scope.albums = [];
    $scope.album = {};

    $scope.get = function (data) {
        scopeApply.apply($scope, function () {
            $scope.albums = data;
            $scope.isLoading = false;
        })
    };

    $scope.newAlbum = function () {
        if ($scope.album.name && $scope.album.description) {
            $rootScope.app.io.ngEmit('album:create', $scope.album);
            $scope.album = {};
        }
    };

    $scope.remove = function (id) {
        $rootScope.app.io.emit('album:remove', id);
    };

    $scope.socket_remove = function (album) {
        scopeApply.apply($scope, function () {
            for (var i = 0; i < $scope.albums.length; i++) {
                var a = $scope.albums[i];
                if (album._id == a._id) {
                    $scope.albums.splice(i, 1);
                    break;
                }
            }
        })
    };

    $scope.socket_create = function (resp) {
        scopeApply.apply($scope, function () {
            if (resp)
                $scope.albums.push(resp);
        })
    };

    $scope.$on('$destroy', function (event) {
        $rootScope.app.io.off('album:get', $scope.get);
        $rootScope.app.io.off('album:create', $scope.socket_create);
        $rootScope.app.io.off('album:remove', $scope.socket_remove);
    });


    $rootScope.app.io.on('album:get', $scope.get);
    $rootScope.app.io.on('album:create', $scope.socket_create);
    $rootScope.app.io.on('album:remove', $scope.socket_remove);

    $rootScope.app.io.emit('album:get', $scope.get);
}]);