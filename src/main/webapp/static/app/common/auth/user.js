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

        this.getAvatarId = function (service) {
            var avatarId = this.getProfileData(service)
            if (!avatarId) {
                if (service === 'github') {
                    avatarId = this.key;
                } else if (service === 'gravatar') {
                    avatarId = this.email;
                }
            }
            return avatarId || '';
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
            this.profileDatas = profile.profileDatas;
            this.favoriteAvatar = profile.favoriteAvatar;
            this.avatarIds = profile.avatarIds;
            this.isLocked = profile.isLocked;
            this.initialised = true;
            return this;
        };

        return this;
    });
