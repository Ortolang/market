'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SettingsCtrl', ['$scope', 'User',
        function ($scope, User) {

            $scope.settingsItems = $scope.populateFields('settings');

            $scope.updateUserProfileData = function (profileData) {
                if (profileData.name === 'settings.avatar') {
                    User.favoriteAvatar = profileData.value;
                } else if (profileData.name === 'settings.facebook' || profileData.name === 'settings.twitter' ||
                        profileData.name === 'settings.github' || profileData.name === 'settings.gravatar') {
                    angular.forEach(User.avatarIds, function (avatarId) {
                        if ('settings.' + avatarId.name === profileData.name) {
                            avatarId.value = profileData.value;
                        }
                    });
                }
                $scope.$parent.updateUserProfileData(profileData);
            };
        }]);
