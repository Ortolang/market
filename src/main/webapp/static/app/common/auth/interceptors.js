'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AuthInterceptor', ['$q', 'AuthService', function ($q, AuthService) {
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
            responseError: function (response) {
                if (response.status === 401) {
                    console.error('session timeout?', response);
                    if (!AuthService.isAuthenticated()) {
                        AuthService.login();
                    }
                } else if (response.status === 403) {
                    console.error('Forbidden', response);
                } else if (response.status === 404) {
                    console.error('Not found', response);
                } else if (response.status) {
                    if (response.data && response.data.errorMessage) {
                        console.error(response.data.errorMessage);
                    } else {
                        console.error('An unexpected server error has occurred', response);
                    }
                }
                return $q.reject(response);
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
