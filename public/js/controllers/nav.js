app.controller('NavCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.buttons = [
        {text:'login', href: '#!/login'}
    ];
    if ($rootScope.app.isLogged()) {
        $scope.buttons = [
            {text: 'index', href: '#!/'},
            {text: 'albums', href: '#!/albums'},
            {text: 'x', href: '#!/logout'}
        ]
    }
}]);