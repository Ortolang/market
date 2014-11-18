'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthService
 * @description
 * # AuthService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
      .factory('AuthService', ['$http', '$location', 'User', 'ProfileResource', 'WorkspaceResource', 'param', '$q', '$filter', function ($http, $location, User, ProfileResource, WorkspaceResource, param, $q, $filter) {
        var authService = {};
        /**
         * Get the user profile from the rest API
         * @param credentials
         * @returns {*}
         */
        authService.getUser = function (credentials) {
            //TODO replace this by a token
            var auth = window.btoa(credentials.username + ':' + credentials.password), deferred = $q.defer();
            $http.defaults.headers.common.Authorization = 'Basic ' + auth;
            ProfileResource.connected().$promise.then(
                // 303 redirect
                function (user) {
                    var userSession = User.create(auth, user);
                    deferred.resolve(userSession);
                },
                function (error) {
                    /**
                     * In the event of a 303 response data ="", and status=0. This seems wrong.
                     * @url https://github.com/angular/angular.js/issues/3336
                     */
//                    console.debug(error);
                    if (error.status === 401 || error.status === 500) {
                        deferred.reject(error);
                    //@todo Temporary hack for localhost
                    } else if (error.status === 0 || error.status === 303) {
                        ProfileResource.get({userId: credentials.username},
                            function (profil) {
                                //console.debug(profil);
                                var userSession = User.create(auth, profil);
                                deferred.resolve(userSession);
                            },
                            function (error) {
                                deferred.reject(error);
                            });
                    }
                }
            );

            return deferred.promise;
        };
        /**
         * Check if user is authenticated
         * @returns {boolean}
         */
        authService.isAuthenticated = function () {
            return !!User.userId;
        };
        /**
         * Check if user is authorized
         * @param wsName
         * @returns {boolean}
         */
        authService.isAuthorized = function (wsName) {
            var found = $filter('filter')(User.userMember, wsName);
            //console.debug(found);
            return (authService.isAuthenticated() &&
                found.length > 0);
        };

        /**
         * Set user id
         * @param userId
         */
        authService.setUserId = function (userId) {
            //TODO replace userId by token
            $http.defaults.headers.common.Authorization = 'Basic ' + userId;
        };
        /**
         * Save the current URL if it isn't the login screen
         * @param path
         */
        authService.saveAttemptUrl = function (path) {
            param.redirectToUrlAfterLogin = path;
            console.debug('saveAttemptUrl', param.redirectToUrlAfterLogin);
        };
        /**
         * Redirect to the saved url
         */
        authService.redirectToAttemptedUrl = function () {
            $location.path('redirectToAttemptedUrl', param.redirectToUrlAfterLogin);
        };
        return authService;
    }]);
