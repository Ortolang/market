'use strict';
/*jshint camelcase: false */

/**
 * @ngdoc service
 * @name ortolangMarketApp.Profile
 * @description
 * # Profile
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Profile', ['$rootScope', '$translate', 'User', 'ProfileResource', 'icons', function ($rootScope, $translate, User, ProfileResource, icons) {

        var visibilityOptions = {
            EVERYBODY: {value: 'EVERYBODY', label: 'PROFILE.VISIBILITY.EVERYBODY', icon: icons.everybody},
            FRIENDS: {value: 'FRIENDS', label: 'PROFILE.VISIBILITY.FRIENDS', icon: icons.friends},
            NOBODY: {value: 'NOBODY', label: 'PROFILE.VISIBILITY.NOBODY', icon: icons.nobody}
        };

        function getVisibilityOptions(mask) {
            if (!mask) {
                return visibilityOptions;
            }
            var visibilityOptionsCopy = visibilityOptions;
            if (mask.charAt(0) !== '3') {
                delete visibilityOptionsCopy.NOBODY;
            }
            if (mask.charAt(1) !== '3') {
                delete visibilityOptionsCopy.FRIENDS;
            }
            if (mask.charAt(2) !== '3') {
                delete visibilityOptionsCopy.EVERYBODY;
            }
            return visibilityOptionsCopy;
        }

        function updateUserProfileData(profileData) {
            if (profileData.name === 'avatar') {
                User.favoriteAvatar = profileData.value;
            } else if (profileData.name === 'facebook' || profileData.name === 'twitter' ||
                    profileData.name === 'github' || profileData.name === 'gravatar') {
                angular.forEach(User.avatarIds, function (avatarId) {
                    if (avatarId.name === profileData.name) {
                        avatarId.value = profileData.value;
                    }
                });
            }
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
        }

        // *********************** //
        //         Address         //
        // *********************** //

        function sanitizeData($data) {
            if ($data.name && Object.keys($data).length === 1) {
                $data = $data.name;
            }
            return $data;
        }

        function checkAddress(item, $data) {
            $data = sanitizeData($data);
            if ($data !== '' && item.value !== $data && !$data.formatted_address) {
                return $translate.instant('PROFILE.INFOS.ADDRESS_ERROR');
            }
        }

        function preventAddressSubmitOnEnter($event, $data, item) {
            if ($event.keyCode === 13) {
                $data = sanitizeData($data);
                if (!$data.formatted_address && item.value !== $data) {
                    $event.preventDefault();
                }
            }
        }

        function getFullAddress(place) {
            if (place.formatted_address.indexOf(place.name) === -1) {
                return place.name + ', ' + place.formatted_address;
            }
            return place.formatted_address;
        }

        function updateUserAddress(profileData) {
            profileData.value = sanitizeData(profileData.value);
            if (profileData.value.formatted_address) {
                var copy = profileData;
                copy.value = getFullAddress(profileData.value);
                updateUserProfileData(copy);
            } else if (profileData.value === '') {
                updateUserProfileData(profileData);
            }
        }

        return {
            getVisibilityOptions: getVisibilityOptions,
            updateUserProfileData: updateUserProfileData,
            updateUserAddress: updateUserAddress,
            checkAddress: checkAddress,
            preventAddressSubmitOnEnter: preventAddressSubmitOnEnter
        };
    }]);
