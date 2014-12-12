'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AuthInterceptor', function($q, Auth) {
        return {
            request: function (config) {
                var deferred = $q.defer();
                if (Auth.isAuthenticated()) {
                    if (Auth.getKeycloak().token) {
                        Auth.getKeycloak().updateToken(5).success(function() {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + Auth.getKeycloak().token;

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
});

/**
 * @ngdoc service
 * @name ortolangMarketApp.ErrorInterceptor
 * @description
 * # ErrorInterceptor
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ErrorInterceptor', function($q, $window, Auth) {
        return function(promise) {
            return promise.then(function(response) {
                return response;
            }, function(response) {
                if (response.status == 401) {
                    console.log('session timeout?');
                    if (!Auth.isAuthenticated()) {
                        $window.location = Auth.getKeycloak().createLoginUrl();
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
    });

angular.module('ortolangMarketApp')
    .config(function($httpProvider) {
        $httpProvider.responseInterceptors.push('ErrorInterceptor');
        $httpProvider.interceptors.push('AuthInterceptor');
    });
