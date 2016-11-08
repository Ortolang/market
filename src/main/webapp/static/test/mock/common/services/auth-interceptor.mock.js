'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.AuthService
 * @description
 * # AuthService
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('AuthInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {

        return {
            request: function (config) {
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    console.error(rejection);
                    $rootScope.$broadcast('unauthorized-user');
                } else if (rejection.status === 403) {
                    console.error('Forbidden', rejection);
                } else if (rejection.status === 404) {
                    console.error('Not found', rejection);
                } else if (rejection.status === 0 || rejection.status === -1) {
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
