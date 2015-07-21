'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.User
 * @description
 * # User
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('User', ['AuthService', function (AuthService) {

        this.profileDatas = {};

        this.name = function () {
            if (this.givenName) {
                return this.givenName + ' ' + this.familyName;
            }
            return '';
        };

        this.getProfileData = function (name) {
            return this.profileDatas[name];
        };

        this.preInit = function (profile) {
            this.givenName = profile.givenName;
            this.familyName = profile.familyName;
        };

        this.create = function (profile) {
            this.key = profile.key;
            this.givenName = profile.givenName;
            this.familyName = profile.familyName;
            this.email = profile.email;
            this.emailHash = profile.emailHash;
            this.emailVisibility = profile.emailVisibility;
            this.status = profile.status;
            this.groups = profile.groups;
            this.desc = profile.desc;
            this.profileDatas = profile.profileDatas;
            this.isLocked = profile.isLocked;
            this.friends = profile.friends;
            return this;
        };

        this.sessionInitialized = AuthService.sessionInitialized;

        this.isAuthenticated = AuthService.isAuthenticated;

        return this;
    }]);
