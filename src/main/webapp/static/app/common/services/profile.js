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
    .factory('Profile', ['$rootScope', '$translate', '$q', 'User', 'ProfileResource', 'ReferentialResource', 'icons', 'Settings', 'Helper', function ($rootScope, $translate, $q, User, ProfileResource, ReferentialResource, icons, Settings, Helper) {

        var organization,
            visibilityOptions = {
                EVERYBODY: {value: 'EVERYBODY', label: 'PROFILE.VISIBILITY.EVERYBODY', icon: icons.everybody},
                FRIENDS: {value: 'FRIENDS', label: 'PROFILE.VISIBILITY.FRIENDS', icon: icons.friends}
            };

        function getVisibilityOptions() {
            return visibilityOptions;
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
                if (profileData.name === 'language') {
                    $rootScope.$broadcast('askLanguageChange', profileData.value);
                }
                if (profileData.type === 'REFERENTIAL') {
                    if (angular.isObject(profileData.value) && profileData.value.id) {
                        profileData.value = Helper.createKeyFromReferentialName(profileData.value.id);
                    } else {
                        profileData.value = profileData.value && profileData.value.length > 0 ? profileData.value : undefined;
                    }
                }
                var profileDataRepresentation = {
                    name: profileData.name,
                    value: profileData.value,
                    type: profileData.type,
                    source: profileData.source,
                    visibility: profileData.forceVisibility ? profileData.forceVisibility : profileData.visibility.value
                };
                ProfileResource.updateProfileInfos({key: User.key}, profileDataRepresentation, function () {
                    User.profileDatas[profileData.name] = profileDataRepresentation;
                });
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

        function searchOrganization(query) {
            if (Helper.extractNameFromReferentialId(query)) {
                return [];
            }
            if (!query || angular.isObject(query) || query.length < 2) {
                return [];
            }
            var deferred = $q.defer();
            ReferentialResource.list({type: 'ORGANIZATION', lang: 'FR', term: query}, function (results) {
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
            var deferred = $q.defer(),
                referentialName = Helper.extractNameFromReferentialId(name);
            if (referentialName) {
                if (organization && organization.id === referentialName) {
                    if (force) {
                        return organization.fullname;
                    }
                    deferred.resolve(organization);
                } else if (referentialName && !once) {
                    once = true;
                    ReferentialResource.get({name: referentialName}, function (data) {
                        if (data) {
                            organization = data.content;
                            once = false;
                            deferred.resolve(organization.fullname);
                        } else {
                            organization = null;
                        }
                    });
                }
            } else {
                return name;
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
            getOrganization: getOrganization
        };
    }]);
