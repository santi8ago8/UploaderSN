app.controller('MainCtrl',
    ['$scope', '$rootScope', 'scopeApply', '$location', 'FileUploader',
        function ($scope, $rootScope, scopeApply, $location, FileUploader) {

            if (!$rootScope.app.isLogged()) {
                $location.url('/login');
            }

            $scope.photos = [];

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

            $scope.socket_get = function (photos) {
                scopeApply.apply($scope, function () {
                    $scope.photos = photos;
                });
            };

            $scope.socket_added = function (photo) {
                scopeApply.apply($scope, function () {
                    $scope.photos.push(photo);
                });
            };

            $scope.newComment = function (comment) {
                scopeApply.apply($scope, function () {
                    $scope.comments.push(comment);
                });
            };

            $rootScope.app.io.on('photo:get', $scope.socket_get);
            $rootScope.app.io.on('photo:added', $scope.socket_added);

            $scope.$on('$destroy', function (event, _) {
                $rootScope.app.io.off('photo:get', $scope.socket_get);
                $rootScope.app.io.off('photo:added', $scope.socket_added);
            });

            $rootScope.app.io.emit('photo:get');
        }
    ]);