app.controller('MainCtrl',
    ['$scope', '$rootScope', 'scopeApply', '$location', 'FileUploader',
        function ($scope, $rootScope, scopeApply, $location, FileUploader) {

            $scope.photos = [];
            $scope.albums = [];

            var uploader = $scope.uploader = new FileUploader({
                url: '/file/upload'
            });

            $scope.uploadNext = function () {
                for (var i = 0; i < uploader.queue.length; i++) {
                    var file = uploader.queue[i];
                    if (!file.isSuccess) {
                        file.upload();
                        break;
                    }
                }
                var allEnds = true;
                for (var i = 0; i < uploader.queue.length; i++) {
                    var file = uploader.queue[i];
                    if (!file.isSuccess)
                        allEnds = false;
                }
                if (allEnds) {
                    uploader.clearQueue();
                }
            };

            uploader.onAfterAddingFile = function (fileItem) {
                $scope.uploadNext();
            };
            uploader.onProgressItem = function (fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem');//, fileItem, response, status, headers);
                $scope.uploadNext();
            };

            $scope.socket_get = function (data) {
                scopeApply.apply($scope, function () {
                    $scope.photos = data.photos;
                    $scope.albums = data.albums;
                });
            };

            $scope.socket_added = function (photo) {
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
                console.log(send);
                $rootScope.app.io.emit('photo:save', send);
            };

            $scope.socket_save = function (photo) {
                scopeApply.apply($scope, function () {
                    for (var i = 0; i < $scope.photos.length; i++) {
                        var p = $scope.photos[i];
                        if (p._id == photo._id) {
                            var isEd = $scope.photos[i].$isEdit;
                            $scope.photos[i] = photo;
                            $scope.photos[i].$isEdit = isEd;
                        }
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


            $rootScope.app.io.on('photo:get', $scope.socket_get);
            $rootScope.app.io.on('photo:added', $scope.socket_added);
            $rootScope.app.io.on('photo:save', $scope.socket_save);
            $rootScope.app.io.on('photo:remove', $scope.socket_remove);

            $scope.$on('$destroy', function (event, _) {
                $rootScope.app.io.off('photo:get', $scope.socket_get);
                $rootScope.app.io.off('photo:added', $scope.socket_added);
                $rootScope.app.io.off('photo:save', $scope.socket_save);
                $rootScope.app.io.off('photo:remove', $scope.socket_remove);
            });

            $rootScope.app.io.emit('photo:get');
        }
    ]);
