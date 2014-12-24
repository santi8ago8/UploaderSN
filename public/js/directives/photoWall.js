app.controller('photoWallCtrl', ['$scope', '$rootScope', 'scopeApply', '$imgViewer', '$element', '$timeout',
    function ($scope, $rootScope, scopeApply, $imgViewer, $element, $timeout) {

        $scope.socket_get = function (data) {
            scopeApply.apply($scope, function () {
                $scope.photos = data.photos;
                $scope.albums = data.albums;
            });
        };

        $scope.socket_added = function (photo) {
            if ($scope.album == 'all' || $scope.album == photo.album)
                scopeApply.apply($scope, function () {
                    $scope.photos.push(photo);
                });
        };

        $scope.doDescription = function (p) {
            //1/200s 4.8f 190mm #dog #dogs #without #freedom
            var f = new Fraction(p.meta.exif.ExposureTime);

            p.description =
                f.numerator + '/' + f.denominator + 's ' +
                p.meta.exif.FNumber + 'f ' +
                'ISO-' + p.meta.exif.ISO + ' ' +
                p.meta.exif.FocalLength + 'mm ';
            for (var i = 0; i < $scope.albums.length; i++) {
                var album = $scope.albums[i];
                if (p.album == album._id) {
                    p.description += album.description + ' ';
                }
            }

        };

        $scope.save = function (p) {
            var send = angular.copy(p);
            delete send.$isEdit;
            $rootScope.app.io.emit('photo:save', send);
        };

        $scope.socket_save = function (photo) {

            scopeApply.apply($scope, function () {
                var added = false;
                for (var i = 0; i < $scope.photos.length; i++) {
                    var p = $scope.photos[i];
                    if (p._id == photo._id) {
                        var isEd = $scope.photos[i].$isEdit;
                        $scope.photos[i] = photo;
                        $scope.photos[i].$isEdit = isEd;
                        added = true;
                    }
                }
                if (!added) {
                    $scope.photos.push(photo);
                }
            });

        };

        $scope.remove = function (photo) {
            $rootScope.app.io.emit('photo:remove', {_id: photo._id})
        };
        $scope.socket_remove = function (id) {
            scopeApply.apply($scope, function () {
                for (var i = 0; i < $scope.photos.length; i++) {
                    var p = $scope.photos[i];
                    if (p._id == id) {
                        $scope.photos.splice(i, 1);
                        break;
                    }
                }
            });
        };

        $scope.open = function (index, ev) {
            //debugger;
            $imgViewer.open($scope.photos, index, ev);
        };

        $timeout(function () {
            var album = $element.attr('album');
            album = $scope.album = album ? album : 'all';


            $rootScope.app.io.on('photo:get:' + album, $scope.socket_get);
            $rootScope.app.io.on('photo:added', $scope.socket_added);
            $rootScope.app.io.on('photo:save', $scope.socket_save);
            $rootScope.app.io.on('photo:remove', $scope.socket_remove);

            $scope.$on('$destroy', function (event, _) {
                $rootScope.app.io.off('photo:get:' + album, $scope.socket_get);
                $rootScope.app.io.off('photo:added', $scope.socket_added);
                $rootScope.app.io.off('photo:save', $scope.socket_save);
                $rootScope.app.io.off('photo:remove', $scope.socket_remove);
            });


            $rootScope.app.io.emit('photo:get', {album: album});
        });


    }]);
app.directive('photoWall', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/html/photoWall.html',
        link: function ($scope, element, attrs) {

        },
        controller: 'photoWallCtrl'
    }
});