'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AuthEvents
 * @description
 * # AuthEvents
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('AuthEvents', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });
