'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthService
 * @description
 * # AuthService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
      .factory('AuthService', ['$http', 'Session', 'ProfilDAO', 'WorkspacesDAO', '$q', '$filter', function ($http, Session, ProfilDAO, WorkspacesDAO, $q, $filter) {
        var authService = {};
        /**
         * Get the user profile from the rest API
         * @param credentials
         * @returns {*}
         */
        authService.getSession = function (credentials) {
            //TODO replace this by a token
            var auth = window.btoa(credentials.username + ':' + credentials.password), deferred = $q.defer();
            $http.defaults.headers.common.Authorization = 'Basic ' + auth;
            ProfilDAO.get({userId: credentials.username},
                function (profil) {
//                    console.debug(profil);
                    var session = Session.create(auth, profil);
                    deferred.resolve(session);
                },
                function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        /**
         * Check if user is authenticated
         * @returns {boolean}
         */
        authService.isAuthenticated = function () {
            return !!Session.userId;
        };
        /**
         * Check if user is authorized
         * @param wsName
         * @returns {boolean}
         */
        authService.isAuthorized = function (wsName) {
            var found = $filter('filter')(Session.userMember, wsName);
            //console.debug(found);
            return (authService.isAuthenticated() &&
                found.length > 0);
        };
        /**
         * Get the workspaces of the given user
         * @param userId
         */
        authService.getWorkspaces = function (userId) {
            var deferred = $q.defer(), wkList = [];
            //TODO replace userId by token
            $http.defaults.headers.common.Authorization = 'Basic ' + userId;
            WorkspacesDAO.get(
                function (wk) {
                    wkList = wk.entries;
                    //console.debug( wkList);
                    deferred.resolve(wkList);
                },
                function (error) {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };
        return authService;
    }]);
