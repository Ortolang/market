'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AuthInterceptor', ['$q', 'AuthService', function($q, AuthService) {
        return {
            request: function (config) {
                var deferred = $q.defer();
                if (AuthService.isAuthenticated()) {
                    if (AuthService.getToken()) {
                        AuthService.getKeycloak().updateToken(5).success(function() {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + AuthService.getToken();
                            deferred.resolve(config);
                        }).error(function() {
                            deferred.reject('Failed to refresh token');
                        });
                    }
                    return deferred.promise;
                } else {
                    return config;
                }
            }
        };
}]);

/**
 * @ngdoc service
 * @name ortolangMarketApp.ErrorInterceptor
 * @description
 * # ErrorInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ErrorInterceptor', ['$q', 'AuthService', function($q, AuthService) {
        return function(promise) {
            return promise.then(function(response) {
                return response;
            }, function(response) {
                if (response.status == 401) {
                    console.log('session timeout?');
                    if (!AuthService.isAuthenticated()) {
                        AuthService.login();
                    }
                } else if (response.status == 403) {
                    alert("Forbidden");
                } else if (response.status == 404) {
                    alert("Not found");
                } else if (response.status) {
                    if (response.data && response.data.errorMessage) {
                        alert(response.data.errorMessage);
                    } else {
                        alert("An unexpected server error has occurred");
                    }
                }
                return $q.reject(response);
            });
        };
    }]);

angular.module('ortolangMarketApp')
    .config(function($httpProvider) {
        $httpProvider.responseInterceptors.push('ErrorInterceptor');
        $httpProvider.interceptors.push('AuthInterceptor');
    })
    .run(['$rootScope', 'AuthService', function ($rootScope, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, current) {
            if (current.requiresAuthentication && !AuthService.isAuthenticated()) {
                AuthService.login();
            }
        });
    }]);
