'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.User
 * @description
 * # User
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('User', function () {
        /**
         * Create a new user
         * @param profile
         */
        this.create = function (profile) {
            this.id = profile.key;
            this.userId = profile.key;
            this.name = profile.givenName + ' ' + profile.familyName;
            this.firstname = profile.givenName;
            this.lastname = profile.familyName;
            this.email = profile.email;
            this.status = profile.status;
            this.userMember = profile.groups;
            this.desc = profile.desc;
            this.favoriteAvatar = profile.favoriteAvatar;
            this.avatarIds = profile.avatarIds;
            this.isLocked = profile.isLocked;
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
            this.firstname = (user.firstname)? user.firstname : user.givenName;
            this.lastname = (user.lastname)? user.lastname : user.familyName;
            this.email = user.email;
            this.status = user.status;
            this.userMember = user.userMember;
            this.desc = user.desc;
            this.favoriteAvatar = user.favoriteAvatar;
            this.avatarIds = user.avatarIds;
            this.isLocked = user.isLocked;
            return this;
        };
        /**
         * Destroy current user
         */
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.name = null;
            this.firstname = null;
            this.lastname = null;
            this.email = null;
            this.status = null;
            this.userMember = null;
            this.favoriteAvatar = null;
            this.avatarIds = null;
        };
        return this;
    });
