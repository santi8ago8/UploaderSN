app.controller('MainCtrl',
    ['$scope', '$rootScope', 'scopeApply', 'FileUploader', '$imgViewer',
        function ($scope, $rootScope, scopeApply, FileUploader, $imgViewer) {

            //$scope.photos = [];
            //$scope.albums = [];


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

        }
    ]);
