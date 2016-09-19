'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'ProfileResource', 'User', 'GroupResource', 'SearchResource', 'AuthService', 'Profile',
        function ($scope, $rootScope, $routeParams, $location, ProfileResource, User, GroupResource, SearchResource, AuthService, Profile) {

            $scope.isFriend = function () {
                return User.isFriend($scope.key);
            };

            $scope.addToFriends = function () {
                if (!User.isAuthenticated()) {
                    AuthService.login();
                    return;
                }
                if (User.key === $scope.key) {
                    return;
                }
                GroupResource.addMember({key: User.friends, member: $scope.key}, {}, function (data) {
                    User.friendList = data.members;
                });
            };

            $scope.fullName = function () {
                if ($scope.profile) {
                    return $scope.profile.givenName + ' ' + $scope.profile.familyName;
                }
            };

            (function init() {
                User.fetchFriendList();
                $scope.key = $routeParams.key;
                if (User.isAuthenticated() && angular.isDefined($location.search()['see-as'])) {
                    ProfileResource.get({key: $scope.key}, function (data) {
                        $scope.profile = data;
                        $rootScope.ortolangPageTitle = $scope.fullName() + ' | ';
                    });
                    ProfileResource.getInfos({key: $scope.key}, function (data) {
                        $scope.infos = {};
                        angular.forEach(data.entries, function (profileData) {
                            if (profileData.name === 'organisation') {
                                Profile.getOrganization(profileData.value).then(function (data) {
                                    $scope.infos[profileData.name] = data;
                                });
                            } else {
                                $scope.infos[profileData.name] = profileData.value;
                            }
                        });
                    });
                } else {
                    SearchResource.getProfile({key: $scope.key}, function (data) {
                        /*jshint camelcase:false */
                        $scope.profile = data.meta_profile;
                        $scope.infos = data.meta_profile.infos;
                        if ($scope.infos.organisation) {
                            Profile.getOrganization($scope.infos.organisation).then(function (data) {
                                $scope.infos.organisation = data;
                            });
                        }
                    });
                }
            }());

        }]);
