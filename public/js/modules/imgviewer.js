/**
 * Created by santi8ago8 on 23/12/14.
 */

app.controller('imgViewerController', ['$scope', '$rootScope', '$mdDialog', 'scopeApply', function ($scope, $rootScope, $mdDialog, scopeApply) {
    $scope.imgViewer = $rootScope.app.imgViewer;

    $scope.increment = function (cant) {
        $scope.imgViewer.index += cant;
        if ($scope.imgViewer.index >= $scope.imgViewer.photos.length) {
            $scope.imgViewer.index = 0;
        }
        if ($scope.imgViewer.index < 0) {
            $scope.imgViewer.index = $scope.imgViewer.photos.length - 1;
        }

    };

    $scope.maxHeight = window.innerHeight - window.innerHeight * 0.1;

    $scope.resize = function () {
        scopeApply.apply($scope, function () {
            $scope.maxHeight = window.innerHeight - window.innerHeight * 0.1;
        })
    };

    $scope.keyPress = function (ev) {
        var newVal = 0;
        if (ev.keyCode == 65 || ev.keyCode == 37) {
            newVal--;
        }
        else if (ev.keyCode == 68 || ev.keyCode == 39) {
            newVal++;
        }
        if (newVal != 0) {
            scopeApply.apply($scope, function () {
                $scope.increment(newVal);
            })
        }
    };


    $scope.$on('$destroy', function (event) {
        window.removeEventListener('resize', $scope.resize);
        window.removeEventListener('keydown', $scope.keyPress);
    });

    window.addEventListener('resize', $scope.resize);
    window.addEventListener('keydown', $scope.keyPress);

}]);

app.provider('$imgViewer', [function () {

    var complete = function () {
        //debugger;
    };

    this.$get = ['$mdDialog', '$rootScope', function ($mdDialog, $rootScope) {
        return {
            open: function (photos, index, ev) {
                $rootScope.app.imgViewer = {photos: photos, index: index};
                $mdDialog.show({
                    controller: 'imgViewerController',
                    templateUrl: '/html/imgviewer.html',
                    targetEvent: ev,
                    onComplete: complete
                })
            }
        }
    }]

}]);
