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
            this.firstname = profile.givenName;
            this.lastname = profile.familyName;
            this.email = profile.email;
            this.status = profile.status;
            this.userMember = profile.groups;
            if(profile.favoriteAvatar === undefined || profile.favoriteAvatar === '') {
                this.favoriteAvatar = '0';
            } else {
                this.favoriteAvatar = profile.favoriteAvatar;
            }
            if(profile.avatarIds === undefined || profile.avatarIds.length === 0) {
                this.avatarIds = [
                    { id: '1', name: 'facebook', value: ''},
                    //{ id: '2', name: 'twitter', value: ''},
                    { id: '3', name: 'github', value: profile.key},
                    { id: '4', name: 'gravatar', value: profile.email}];
            } else {
                this.avatarIds = profile.avatarIds;
            }
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
            this.firstname = user.givenName;
            this.lastname = user.familyName;
            this.email = user.email;
            this.status = user.status;
            this.userMember = user.userMember;
            if(user.favoriteAvatar === undefined || user.favoriteAvatar === '') {
                this.favoriteAvatar = '0';
            } else {
                this.favoriteAvatar = user.favoriteAvatar;
            }
            if(user.avatarIds === undefined || user.avatarIds.length === 0) {
                this.avatarIds = [
                    { id: '1', name: 'facebook', value: ''},
                    //{ id: '2', name: 'twitter', value: ''},
                    { id: '3', name: 'github', value: user.key},
                    { id: '4', name: 'gravatar', value: user.email}];
            } else {
                this.avatarIds = user.avatarIds;
            }
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
