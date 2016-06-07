'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.User
 * @description
 * # User
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('User', ['$q', '$filter', 'AuthService', 'GroupResource', function ($q, $filter, AuthService, GroupResource) {

        this.profileDatas = {};

        this.fullName = function () {
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
            this.emailVerified = profile.emailVerified;
            this.emailVisibility = profile.emailVisibility;
            this.status = profile.status;
            this.groups = profile.groups;
            this.desc = profile.desc;
            this.profileDatas = profile.profileDatas;
            this.isLocked = profile.isLocked;
            this.friends = profile.friends;
            this.friendList = undefined;
            this.isModerator = this.groups.indexOf('moderators') >= 0;
            return this;
        };

        this.fetchFriendList = function (refresh) {
            if (!refresh && this.friendList) {
                return;
            }
            var deferred = $q.defer(),
                User = this;
            this.sessionInitialized().then(function () {
                GroupResource.get({key: User.friends}, function (data) {
                    User.friendList = data.members;
                    deferred.resolve(User.friendList);
                });
            });
            return deferred.promise;
        };

        this.isFriend = function (key) {
            if (this.friendList) {
                return $filter('filter')(this.friendList, {key: key}, true).length === 1;
            }
        };

        this.sessionInitialized = AuthService.sessionInitialized;

        this.isAuthenticated = AuthService.isAuthenticated;

        this.isRoot = AuthService.isRoot;

        return this;
    }]);
