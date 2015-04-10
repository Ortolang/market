'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', 'AuthService', '$translate', '$http', 'User', 'Profile', 'icons',
        function ($scope, $rootScope, AuthService, $translate, $http, User, Profile, icons) {

            var fieldTemplates;
            $scope.User = User;
            $scope.icons = icons;

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
                        field.visibility = fieldTemplate.visibility ? Profile.getVisibilityOptions()[fieldTemplate.visibility] : Profile.getVisibilityOptions().EVERYBODY;
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
                {value: 'Mme', text: 'PROFILE.CIVILITY.MISSUS'},
                {value: 'M', text: 'PROFILE.CIVILITY.MISTER'}
            ];

            $scope.avatars = [
                {value: '', text: 'PROFILE.FIELDS.DEFAULT_AVATAR'},
                {value: 'FACEBOOK', text: 'Facebook'},
                //{value: 'TWITTER', text: 'Twitter'},
                {value: 'GITHUB', text: 'GitHub'},
                {value: 'GRAVATAR', text: 'Gravatar'}
            ];

            function init() {
                $scope.activeTab = 0;
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                $http.get('profile/resources/fields.json').then(function (res) {
                    fieldTemplates = res.data;
                    AuthService.sessionInitialized().then(function () {
                        initFields();
                    });
                });
            }

            init();
        }]);
