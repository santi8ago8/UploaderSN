/**
 * Basic config
 */
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                templateUrl: '/html/main.html',
                controller: 'MainCtrl'
            })
            .when('/404', {
                templateUrl: '/html/404.html'
            })
            .when('/login', {
                templateUrl: '/html/login.html',
                controller: 'loginCtrl'
            })
            .when('/albums', {
                templateUrl: '/html/albums.html',
                controller: 'albumsCtrl'
            })
            .when('/logout', {
                templateUrl: '/html/logout.html',
                controller: 'logoutCtrl'
            })
            .otherwise({
                redirectTo: '/404'
            });

    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.app = {};
        $rootScope.app.user = window['user'];
        //connect to socket.io
        $rootScope.app.io = io();
        $rootScope.app.io.ngEmit = function (ev, dat) {
            $rootScope.app.io.emit(ev, angular.copy(dat));
        };

        $rootScope.app.isLogged = function () {
            return ($rootScope.app.user) ? true : false
        };

        // Custom $off function to un-register the listener.
        $rootScope.$off = function (name, listener) {
            var namedListeners = this.$$listeners[name];
            if (namedListeners) {
                // Loop through the array of named listeners and remove them from the array.
                for (var i = 0; i < namedListeners.length; i++) {
                    if (namedListeners[i] === listener) {
                        return namedListeners.splice(i, 1);
                    }
                }
            }
        };


    }])
    .service('scopeApply', [function () {
        this.apply = function (scope, fn) {
            var phase = scope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }
    }]);