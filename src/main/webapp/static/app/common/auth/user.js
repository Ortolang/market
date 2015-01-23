'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.User
 * @description
 * # User
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('User', function User() {
        /**
         * Create a new user
         * @param profile
         */
        this.create = function (profile) {
            this.id = profile.key;
            this.userId = profile.key;
            this.name = profile.givenName + ' ' + profile.familyName;
            this.email = profile.email;
            this.status = profile.status;
            this.userMember = profile.groups;
            return this;
        };
        /**
         * Recreate user (from cookie)
         * @param user
         */
        this.load = function (user) {
            this.id = user.id;
            this.userId = user.userId;
            this.name = user.name;
            this.email = user.email;
            this.status = user.status;
            this.userMember = user.userMember;
            return this;
        };
        /**
         * Destroy current user
         */
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.name = null;
            this.email = null;
            this.status = null;
            this.userMember = null;
        };
        return this;
    });
