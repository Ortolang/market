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

            function loadScript() {
                if (angular.element('#google-maps-script').length === 0) {
                    console.log('Loading Google Maps library');
                    window.initialized = function () {
                        console.log('Google Maps library loaded');
                    };
                    var script = document.createElement('script');
                    script.id = 'google-maps-script';
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initialized';
                    document.body.appendChild(script);
                }
            }

            function init() {
                $scope.activeTab = 0;
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                $http.get('profile/resources/fields.json').then(function (res) {
                    fieldTemplates = res.data;
                    AuthService.sessionInitialized().then(function () {
                        initFields();
                    });
                });
                loadScript();
            }

            init();
        }]);
