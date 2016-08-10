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
    .factory('Profile', ['$rootScope', '$translate', '$q', 'User', 'ProfileResource', 'ReferentialResource', 'icons', function ($rootScope, $translate, $q, User, ProfileResource, ReferentialResource, icons) {

        var organization,
            visibilityOptions = {
                EVERYBODY: {value: 'EVERYBODY', label: 'PROFILE.VISIBILITY.EVERYBODY', icon: icons.everybody},
                FRIENDS: {value: 'FRIENDS', label: 'PROFILE.VISIBILITY.FRIENDS', icon: icons.friends}
            };

        function getVisibilityOptions(mask) {
            if (!mask) {
                return visibilityOptions;
            }
            var visibilityOptionsCopy = visibilityOptions;
            if (mask.charAt(1) !== '3') {
                delete visibilityOptionsCopy.FRIENDS;
            }
            if (mask.charAt(2) !== '3') {
                delete visibilityOptionsCopy.EVERYBODY;
            }
            return visibilityOptionsCopy;
        }

        function updateUserProfileData(profileData) {
            if (profileData.alias) {
                if (User[profileData.alias]) {
                    User[profileData.alias] = profileData.value;
                    if (profileData.alias === 'email') {
                        User.emailVisibility = profileData.visibility.value;
                    }
                    ProfileResource.updateProfile(User, function (updatedProfile) {
                        User.emailHash = updatedProfile.emailHash;
                    });
                }
            } else {
                if (profileData.type === 'REFERENTIAL') {
                    profileData.value = profileData.value.id;
                }
                var profileDataRepresentation = {
                    name: profileData.name,
                    value: profileData.value,
                    type: profileData.type,
                    source: profileData.source,
                    visibility: profileData.visibility.value
                };
                ProfileResource.updateProfileInfos({key: User.key}, profileDataRepresentation, function () {
                    User.profileDatas[profileData.name] = profileDataRepresentation;
                });
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
                return $translate.instant('PROFILE.FIELDS.ADDRESS_ERROR');
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

        // *********************** //
        //       Organization      //
        // *********************** //

        function checkOrganization(profileData, $data) {
            if ($data !== '' && !angular.isObject($data) && !$data.id) {
                return $translate.instant('PROFILE.FIELDS.ORGANISATION_ERROR');
            }
            profileData.value = $data.id;
        }

        function searchOrganization(query) {
            if (!query || angular.isObject(query) || query.length < 2) {
                return [];
            }
            var deferred = $q.defer();
            ReferentialResource.get({type: 'ORGANIZATION', lang: 'FR', term: query}, function (results) {
                var suggestedOrganizations = [];
                angular.forEach(results.entries, function (entity) {
                    var content = entity.content;
                    if (angular.isUndefined(content.compatibilities)) {
                        suggestedOrganizations.push(content);
                    }
                });
                deferred.resolve(suggestedOrganizations);
            }, function () {
                deferred.reject([]);
            });
            return deferred.promise;
        }

        var once;

        function getOrganization(name, force) {
            var deferred = $q.defer();
            if (organization && organization.id === name) {
                if (force) {
                    return organization;
                }
                deferred.resolve(organization);
            } else if (name && !once) {
                once = true;
                ReferentialResource.get({name: name}, function (data) {
                    if (data) {
                        organization = angular.fromJson(data.content);
                        once = false;
                        deferred.resolve(organization);
                    } else {
                        organization = null;
                    }
                });
            }
            return deferred.promise;
        }

        return {
            getVisibilityOptions: getVisibilityOptions,
            updateUserProfileData: updateUserProfileData,
            updateUserAddress: updateUserAddress,
            checkAddress: checkAddress,
            preventAddressSubmitOnEnter: preventAddressSubmitOnEnter,
            searchOrganization: searchOrganization,
            getOrganization: getOrganization,
            checkOrganization: checkOrganization
        };
    }]);
