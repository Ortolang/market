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

        this.initialised = false;

        this.name = function () {
            if (this.givenName) {
                return this.givenName + ' ' + this.familyName;
            }
            return '';
        };

        this.getFavoriteLanguage = function () {
            var profileData = this.getProfileData('settings', 'language');
            return profileData ? profileData.value : undefined;
        };

        this.getProfileData = function (category, name) {
            if (this[category]) {
                var i = 0;
                for (i; i < this[category].length; i++) {
                    if (this[category][i].name.split('.')[1] === name) {
                        return this[category][i];
                    }
                }
            }
            return undefined;
        };

        this.preInit = function (profile) {
            this.givenName = profile.givenName;
            this.familyName = profile.familyName;
        };

        this.create = function create(profile) {
            this.key = profile.key;
            this.givenName = profile.givenName;
            this.familyName = profile.familyName;
            this.email = profile.email;
            this.status = profile.status;
            this.groups = profile.groups;
            this.desc = profile.desc;
            this.infos = profile.infos;
            this.settings = profile.settings;
            this.aboutme = profile.aboutme;
            this.favoriteAvatar = profile.favoriteAvatar;
            this.avatarIds = profile.avatarIds;
            this.isLocked = profile.isLocked;
            this.initialised = true;
            return this;
        };

        return this;
    });
