'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Settings
 * @description
 * # Settings
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Settings', ['$rootScope', '$q', '$location', '$modal', '$translate', 'User', 'ProfileResource', 'AuthService', 'Helper', 'amMoment', function ($rootScope, $q, $location, $modal, $translate, User, ProfileResource, AuthService, Helper, amMoment) {

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

        this.language = 'fr';

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

        function importSettings(settings) {
            if (angular.isDefined(settings) && settings !== 'undefined') {
                angular.forEach(angular.fromJson(settings), function (value, key) {
                    if (angular.isDefined(Settings[key])) {
                        if (angular.isObject(value)) {
                            angular.extend(Settings[key], value);
                        } else {
                            Settings[key] = value;
                        }
                    }
                });
            }
        }

        this.init = function () {
            if (User.isAuthenticated()) {
                User.sessionInitialized().then(function () {
                    var profileData = User.getProfileData('settings');
                    if (profileData) {
                        importSettings(profileData.value);
                    }
                    checkIdHal();
                    deferred.resolve();
                });
            } else if (localStorage !== undefined) {
                importSettings(localStorage.getItem('ortolang.settings'));
                deferred.resolve();
            }
            if (AuthService.isAuthenticated()) {
                AuthService.sessionInitialized().then(function () {
                    initLanguage();
                });
            } else {
                initLanguage();
            }
        };

        function initLanguage() {
            var urlParameterLanguage,
                currentLanguage = $translate.use();
            // If the lang url parameter is defined then remove it and remember the value in urlParameterLanguage var
            if (!urlParameterLanguage && $location.search().lang && ($location.search().lang === 'fr' || $location.search().lang === 'en')) {
                urlParameterLanguage = {value: $location.search().lang};
                // $location.search('lang', undefined);
            }
            // Sets Settings.language to undefined if Setting.language is other than 'fr' or 'en'
            if (Settings.language && Settings.language !== 'fr' && Settings.language !== 'en') {
                Settings.language = undefined;
            }
            // If lang url parameter or Settings.language is defined then set the current language to lang url parameter in priority 
            // or to Settings.language
            if (urlParameterLanguage || Settings.language) {
                urlParameterLanguage = urlParameterLanguage ? urlParameterLanguage.value : Settings.language;
                // if (urlParameterLanguage !== currentLanguage) {
                    // $translate.use(urlParameterLanguage).then(function (language) {
                    //     Settings.language = language;
                    // });
                    Settings.language = urlParameterLanguage;
                    $translate.use(urlParameterLanguage);
                // }
            } else {
                Settings.language = $translate.use();
            }
            var initializedLanguage = urlParameterLanguage || Settings.language;
            amMoment.changeLocale(initializedLanguage);
            angular.element('html').attr('lang', initializedLanguage);
            $rootScope.$emit('languageInitialized', initializedLanguage);
        }

        function changeLanguage(langKey) {
            $translate.use(langKey).then(function (langKey) {
                Settings.language = langKey;
                Settings.store();
                amMoment.changeLocale(langKey);
                angular.element('html').attr('lang', langKey);
            });
        }

        $rootScope.$on('askLanguageChange', function (event, langKey) {
            changeLanguage(langKey || 'fr');
        });

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
