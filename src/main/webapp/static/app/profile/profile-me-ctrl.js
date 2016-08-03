'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileMeCtrl
 * @description
 * # ProfileMeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileMeCtrl', ['$scope', '$rootScope', '$translate', 'User', 'Profile', 'Runtime',
        function ($scope, $rootScope, $translate, User, Profile, Runtime) {

            var fieldTemplates = {
                'civility': {'type': 'ENUM'},
                'title': {'type': 'STRING', 'helper': true},
                'given_name': {'type': 'STRING', 'alias': 'givenName', 'forceVisibilities': '333'},
                'family_name': {'type': 'STRING', 'alias': 'familyName', 'forceVisibilities': '333'},
                'email': {'type': 'EMAIL', 'alias': 'email'},
                'rescue_email': {'type': 'EMAIL', 'forceVisibilities': '300'},
                'organisation': {'type': 'STRING'},
                'job': {'type': 'STRING'},
                'field_of_research': {'type': 'STRING'},
                'address': {'type': 'ADDRESS'},
                'website': {'type': 'URL'},
                'professional_tel': {'type': 'TEL'},
                'tel': {'type': 'TEL'},
                'fax': {'type': 'TEL'},
                'language': {'type': 'ENUM', 'forceVisibilities': '300'},
                'idhal': {'type': 'STRING', 'helper': true, 'forceVisibilities': '333'},
                'orcid': {'type': 'STRING', 'helper': true, 'forceVisibilities': '333'},
                'viaf': {'type': 'STRING', 'helper': true, 'forceVisibilities': '333'},
                'myidref': {'type': 'STRING', 'helper': true, 'forceVisibilities': '333'},
                'linkedin': {'type': 'URL', 'helper': true, 'forceVisibilities': '333'},
                'viadeo': {'type': 'STRING', 'helper': true, 'forceVisibilities': '333'},
                'presentation': {'type': 'TEXT'}
            };

            $scope.User = User;
            $scope.Runtime = Runtime;

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');
            });

            function initFields() {
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
                        forceVisibilities: fieldTemplate.forceVisibilities
                    };
                    if (profileData) {
                        field.value = fieldTemplate.alias ? User[fieldTemplate.alias] : profileData.value;
                        field.visibility = Profile.getVisibilityOptions()[profileData.visibility];
                    } else {
                        field.value = field.alias ? User[field.alias] : '';
                        if (fieldTemplate.alias === 'email') {
                            field.visibility = Profile.getVisibilityOptions()[User.emailVisibility];
                        } else {
                            field.visibility = fieldTemplate.visibility ? Profile.getVisibilityOptions()[fieldTemplate.visibility] : Profile.getVisibilityOptions().EVERYBODY;
                        }
                    }
                    result[profileDataName] = field;
                });
                $scope.fields = result;
            }

            $scope.languages = [
                {value: 'fr', text: 'NAV.LANGUAGE.FRENCH'},
                {value: 'en', text: 'NAV.LANGUAGE.ENGLISH'}
            ];

            $scope.civilities = [
                {value: 'Ms', text: 'PROFILE.CIVILITY.MISSUS'},
                {value: 'Mr', text: 'PROFILE.CIVILITY.MISTER'}
            ];

            $scope.labelClass = 'col-sm-5 col-md-4';
            $scope.inputClass = 'col-sm-7 col-lg-6';
            $scope.helpClass = 'col-sm-offset-5 col-sm-7 col-md-offset-4 col-md-8';

            (function init() {
                $scope.activeTab = 0;
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                User.sessionInitialized().then(function () {
                    initFields();
                });
            }());

        }]);
