'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$routeParams', '$translate', 'User', 'Profile', 'Runtime', 'Settings', 'Helper',
        function ($scope, $rootScope, $routeParams, $translate, User, Profile, Runtime, Settings, Helper) {

            var fieldTemplates = {
                'civility': {'type': 'ENUM'},
                'title': {'type': 'STRING', 'helper': true},
                'given_name': {'type': 'STRING', 'alias': 'givenName', 'forceVisibility': 'EVERYBODY'},
                'family_name': {'type': 'STRING', 'alias': 'familyName', 'forceVisibility': 'EVERYBODY'},
                'email': {'type': 'EMAIL', 'alias': 'email'},
                'rescue_email': {'type': 'EMAIL', 'forceVisibility': 'NOBODY'},
                'organisation': {'type': 'REFERENTIAL'},
                'job': {'type': 'STRING'},
                'field_of_research': {'type': 'STRING'},
                'address': {'type': 'ADDRESS'},
                'website': {'type': 'URL'},
                'professional_tel': {'type': 'TEL'},
                'language': {'type': 'ENUM', 'forceVisibility': 'NOBODY'}, // settings.language
                'idhal': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'orcid': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'viaf': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'myidref': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'linkedin': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'viadeo': {'type': 'STRING', 'helper': true, 'forceVisibility': 'EVERYBODY'},
                'presentation': {'type': 'TEXT'}
            }, initialized;

            $scope.User = User;
            $scope.Runtime = Runtime;
            $scope.Helper = Helper;

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');
            });

            $rootScope.$on('updateProfileFields', function () {
                if (initialized) {
                    initFields();
                }
            });

            function initFields() {
                initialized = true;
                var result = {},
                    field,
                    profileData;
                angular.forEach(fieldTemplates, function (fieldTemplate, profileDataName) {
                    profileData = User.getProfileData(profileDataName);
                    field = {
                        name: profileDataName,
                        type: fieldTemplate.type,
                        helper: fieldTemplate.helper,
                        alias: fieldTemplate.alias,
                        forceVisibility: fieldTemplate.forceVisibility
                    };
                    if (profileData) {
                        if (fieldTemplate.alias) {
                            if (/^settings\./.test(fieldTemplate.alias)) {
                                field.value = Settings[fieldTemplate.alias.substr(fieldTemplate.alias.indexOf('.') + 1)];
                            } else {
                                field.value = User[fieldTemplate.alias];
                            }
                        } else {
                            field.value = profileData.value;
                        }
                        field.visibility = Profile.getVisibilityOptions()[profileData.visibility];
                    } else {
                        field.value = field.alias ? User[field.alias] : '';
                        if (fieldTemplate.alias === 'email') {
                            field.visibility = Profile.getVisibilityOptions()[User.emailVisibility];
                        } else {
                            if (fieldTemplate.visibility) {
                                field.visibility = Profile.getVisibilityOptions()[fieldTemplate.visibility];
                            } else if (!fieldTemplate.forceVisibility) {
                                field.visibility = Profile.getVisibilityOptions().EVERYBODY;
                            }
                        }
                    }
                    result[profileDataName] = field;
                });
                $scope.fields = result;
            }

            $scope.languages = [
                {value: '', text: ''},
                {value: 'fr', text: 'NAV.LANGUAGE.FRENCH'},
                {value: 'en', text: 'NAV.LANGUAGE.ENGLISH'}
            ];

            $scope.civilities = [
                {value: '', text: ''},
                {value: 'Ms', text: 'PROFILE.CIVILITY.MISSUS'},
                {value: 'Mr', text: 'PROFILE.CIVILITY.MISTER'}
            ];

            $scope.labelClass = 'col-sm-5 col-md-4';
            $scope.inputClass = 'col-sm-7 col-lg-6';
            $scope.helpClass = 'col-sm-offset-5 col-sm-7 col-md-offset-4 col-md-8';

            (function init() {
                $scope.models = {
                    activeTab: 0
                };
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                User.sessionInitialized().then(function () {
                    initFields();
                    if ($routeParams.tab) {
                        $scope.models.activeTab = Number.parseInt($routeParams.tab, 10);
                    }
                });
            }());

        }]);
