'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AuthInterceptor', ['$q', '$rootScope', 'AuthService', function ($q, $rootScope, AuthService) {
        return {
            request: function (config) {
                var deferred = $q.defer();
                if (AuthService.isAuthenticated()) {
                    if (AuthService.getToken()) {
                        AuthService.getKeycloak().updateToken(5).success(function () {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + AuthService.getToken();
                            deferred.resolve(config);
                        }).error(function () {
                            deferred.reject('Failed to refresh token');
                            AuthService.forceReload();
                        });
                    }
                    return deferred.promise;
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    console.error(rejection);
                    if (!AuthService.isAuthenticated()) {
                        $rootScope.$broadcast('user-not-logged-in');
                    } else {
                        $rootScope.$broadcast('unauthorized-user');
                    }
                } else if (rejection.status === 403) {
                    console.error('Forbidden', rejection);
                } else if (rejection.status === 404) {
                    console.error('Not found', rejection);
                } else if (rejection.status === 0) {
                    $rootScope.$broadcast('server-down');
                    console.error('An unexpected server error has occurred. Server might be currently unavailable.', rejection);
                } else {
                    if (rejection.data && rejection.data.errorMessage) {
                        console.error(rejection.data.errorMessage);
                    } else {
                        console.error('An unexpected server error has occurred', rejection);
                    }
                }
                return $q.reject(rejection);
            }
        };
    }]);

angular.module('ortolangMarketApp')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .run(['$rootScope', 'AuthService', function ($rootScope, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, current) {
            if (current.requiresAuthentication && !AuthService.isAuthenticated()) {
                AuthService.login();
            }
        });
    }]);
