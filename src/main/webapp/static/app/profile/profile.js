'use strict';
/*jshint camelcase: false */

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$filter', '$translate', '$http', 'User', 'ProfileResource', 'icons',
        function ($scope, $rootScope, $filter, $translate, $http, User, ProfileResource, icons) {

            $scope.User = User;
            $scope.icons = icons;

            // *********************** //
            //         Address         //
            // *********************** //

            function sanitizeData($data) {
                if ($data.name && Object.keys($data).length === 1) {
                    $data = $data.name;
                }
                return $data;
            }

            $scope.checkAddress = function (item, $data) {
                $data = sanitizeData($data);
                if ($data !== '' && item.value !== $data && !$data.formatted_address) {
                    return $translate.instant('PROFILE.INFOS.ADDRESS_ERROR');
                }
            };

            $scope.preventSubmitOnEnter = function ($event, $data, item) {
                if ($event.keyCode === 13) {
                    $data = sanitizeData($data);
                    if (!$data.formatted_address && item.value !== $data) {
                        $event.preventDefault();
                    }
                }
            };

            function getFullAddress(place) {
                if (place.formatted_address.indexOf(place.name) === -1) {
                    return place.name + ', ' + place.formatted_address;
                }
                return place.formatted_address;
            }

            $scope.updateUserAddress = function (profileData) {
                profileData.value = sanitizeData(profileData.value);
                if (profileData.value.formatted_address) {
                    var copy = profileData;
                    copy.value = getFullAddress(profileData.value);
                    $scope.updateUserProfileData(copy);
                } else if (profileData.value === '') {
                    $scope.updateUserProfileData(profileData);
                }
            };

            // *********************** //
            //         Language        //
            // *********************** //

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');
            });

            $scope.updateUserProfileData = function (profileData) {
                if (profileData.alias) {
                    if (User[profileData.alias]) {
                        User[profileData.alias] = profileData.value;
                        ProfileResource.put(User);
                    }
                } else {
                    var formData = {
                        name: profileData.name,
                        value: profileData.value,
                        type: profileData.type,
                        source: profileData.source,
                        visibility: profileData.visibility.value
                    };
                    ProfileResource.update({key: User.key}, formData);
                    if (profileData.source === 'languages') {
                        $rootScope.$broadcast('askLanguageChange', profileData.value);
                    }
                }
            };

            $scope.populateFields = function (category) {
                var filledFields = {},
                    result = [],
                    field,
                    profileDataTemplate;
                angular.forEach(User[category], function (profileData) {
                    var profileDataName = profileData.name.split('.')[1],
                        item;
                    profileDataTemplate = $scope.fields[category][profileDataName];
                    if (profileDataTemplate) {
                        item = {
                            name: profileData.name,
                            value: profileDataTemplate.alias ? User[profileDataTemplate.alias] : profileData.value,
                            type: profileData.type,
                            source: profileData.source,
                            visibility: $scope.visibilityOptions[profileData.visibility],
                            helper: profileDataTemplate.helper,
                            alias: profileDataTemplate.alias,
                            forceVisibilities: profileDataTemplate.forceVisibilities
                        };
                        filledFields[profileDataName] = item;
                    }
                });

                angular.forEach($scope.fields[category], function (value, key) {
                    if (filledFields[key]) {
                        result.push(filledFields[key]);
                    } else {
                        profileDataTemplate = $scope.fields[category][key];
                        field = value;
                        field.name = category + '.' + key;
                        field.value = field.alias ? User[field.alias] : '';
                        field.visibility = profileDataTemplate.visibility ? $scope.visibilityOptions[profileDataTemplate.visibility] : $scope.visibilityOptions.EVERYBODY;
                        result.push(field);
                    }
                });
                return result;
            };

            $scope.visibilityOptions = {
                EVERYBODY: {value: 'EVERYBODY', label: 'PROFILE.VISIBILITY.EVERYBODY', icon: icons.everybody},
                FRIENDS: {value: 'FRIENDS', label: 'PROFILE.VISIBILITY.FRIENDS', icon: icons.friends},
                NOBODY: {value: 'NOBODY', label: 'PROFILE.VISIBILITY.NOBODY', icon: icons.nobody}
            };

            $scope.getVisibilityOptions = function (mask) {
                if (!mask) {
                    return $scope.visibilityOptions;
                }
                var visibilityOptions = $scope.visibilityOptions;
                if (mask.charAt(0) !== '3') {
                    delete visibilityOptions.NOBODY;
                }
                if (mask.charAt(1) !== '3') {
                    delete visibilityOptions.FRIENDS;
                }
                if (mask.charAt(2) !== '3') {
                    delete visibilityOptions.EVERYBODY;
                }
                return visibilityOptions;
            };

            $scope.showValue = function (value, source) {
                var item = $filter('filter')($scope[source], {value: value}, true);
                if (item === undefined || item.length === 0) {
                    return undefined;
                }
                return item[0].text;
            };

            $scope.languages = [
                {value: 'fr', text: 'NAV.LANGUAGE.FRENCH'},
                {value: 'en', text: 'NAV.LANGUAGE.ENGLISH'}
            ];

            $scope.civilities = [
                {value: 'Mme', text: 'PROFILE.CIVILITY.MISSUS'},
                {value: 'M', text: 'PROFILE.CIVILITY.MISTER'}
            ];

            function init() {
                $scope.activeTab = 0;
                $scope.emptyText = $translate.instant('PROFILE.EMPTY');

                $http.get('profile/resources/fields.json').then(function (res) {
                    $scope.fields = res.data;
                });

                $http.get('profile/resources/countries.json')
                    .then(function (res) {
                        $scope.countries = res.data;
                    });

                $http.get('profile/resources/states.json')
                    .then(function (res) {
                        $scope.states = res.data;
                    });

                $scope.avatars = [
                    {value: '', text: 'PROFILE.SETTINGS.DEFAULT_AVATAR'},
                    {value: 'FACEBOOK', text: 'Facebook'},
                    //{value: 'TWITTER', text: 'Twitter'},
                    {value: 'GITHUB', text: 'GitHub'},
                    {value: 'GRAVATAR', text: 'Gravatar'}
                ];
            }

            init();
        }]);
