'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Settings
 * @description
 * # Settings
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Settings', ['$rootScope', '$q', '$location', '$modal', 'User', 'ProfileResource', 'Helper', function ($rootScope, $q, $location, $modal, User, ProfileResource, Helper) {

        var deferred = $q.defer(),
            Settings = this;

        this.browser = {
            workspace: {
                hideInfo: false,
                hideWorkspaceList: false
            },
            market: {
                hideInfo: false
            },
            fileSelect: {}
        };

        this.language = undefined;

        this.cart = {};

        this.profileUpdate = {};

        this.searchHistory = [];

        this.putSearch = function (type, params) {
            var search = {
                type: type,
                params: params,
                date: Date.now()
            };
            for (var i = 0; i < this.searchHistory.length; i++) {
                var previous = this.searchHistory[i];
                if (previous.type === search.type && previous.params.content === search.params.content && previous.params.filters === search.params.filters) {
                    this.searchHistory.splice(i, 1);
                    break;
                }
            }
            this.searchHistory.unshift(search);
            if (this.searchHistory.length > 10) {
                this.searchHistory.slice(0, 10);
            }
            this.store();
        };

        this.store = function () {
            if (User.isAuthenticated()) {
                User.sessionInitialized().then(function () {
                    if (angular.isUndefined(User.getProfileData('settings')) || User.getProfileData('settings').value !== angular.toJson(Settings)) {
                        var profileDataRepresentation = {
                            name: 'settings',
                            value: angular.toJson(Settings),
                            type: 'STRING',
                            source: null,
                            visibility: 'NOBODY'
                        };
                        ProfileResource.updateProfileInfos({key: User.key}, profileDataRepresentation, function () {
                            User.profileDatas.settings = profileDataRepresentation;
                        });
                        $rootScope.$emit('updateProfileFields');
                    }
                });
            } else if (localStorage !== undefined) {
                localStorage.setItem('ortolang.settings', angular.toJson(Settings));
            }
        };

        this.initialized = function () {
            return deferred.promise;
        };

        this.init = function () {
            if (User.isAuthenticated()) {
                User.sessionInitialized().then(function () {
                    var profileData = User.getProfileData('settings');
                    if (profileData) {
                        var savedSettings = profileData.value;
                        if (savedSettings && savedSettings !== 'undefined') {
                            angular.forEach(angular.fromJson(savedSettings), function (value, key) {
                                if (angular.isObject(value)) {
                                    angular.extend(Settings[key], value);
                                } else {
                                    Settings[key] = value;
                                }
                            });
                        }
                    }
                    checkIdHal();
                    deferred.resolve();
                });
            } else if (localStorage !== undefined) {
                var savedSettings = localStorage.getItem('ortolang.settings');
                if (savedSettings && savedSettings !== 'undefined') {
                    angular.forEach(angular.fromJson(savedSettings), function (value, key) {
                        if (angular.isObject(value)) {
                            angular.extend(Settings[key], value);
                        } else {
                            Settings[key] = value;
                        }
                    });
                }
                deferred.resolve();
            }
        };

        function checkIdHal() {
            if (angular.isUndefined(User.getProfileData('idhal'))) {
                // 86400000ms = 1 day
                if (Settings.profileUpdate.idHal !== -1 && (angular.isUndefined(Settings.profileUpdate.idHal) || Date.now() - Settings.profileUpdate.idHal > 86400000) ) {
                    var modalScope = Helper.createModalScope(), modal;
                    modalScope.action = function (name) {
                        switch (name) {
                            case 'set':
                            case 'later':
                                Settings.profileUpdate.idHal = Date.now();
                                break;
                            case 'never':
                                Settings.profileUpdate.idHal = -1;
                                break;
                        }
                        Settings.store();
                        modal.hide();
                        if (name === 'set') {
                            $location.url('profiles/me/edition?tab=3');
                        }
                    };
                    modal = $modal({
                        show: true,
                        templateUrl: 'common/templates/update-profile-modal.html',
                        scope: modalScope
                    });
                }
            }
        }

        this.init();

        return this;
    }]);
