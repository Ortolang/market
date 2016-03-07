'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$translate', '$http', 'User', 'Profile', 'Runtime',
        function ($scope, $rootScope, $translate, $http, User, Profile, Runtime) {

            var fieldTemplates;
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

            function init() {
                $scope.activeTab = 0;
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                $http.get('profile/resources/fields.json').then(function (res) {
                    fieldTemplates = res.data;
                    User.sessionInitialized().then(function () {
                        initFields();
                    });
                });
            }

            init();
        }]);
