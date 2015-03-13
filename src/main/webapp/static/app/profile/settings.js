'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SettingsCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', 'User',
        function ($scope, $routeParams, ProfileResource, $filter, User) {

            /**
             * INIT
             */
            $scope.settings = [
                {name: 'avatar', value: '4', type: 'RADIO', source: 'avatars', visibility: $scope.visibilityOptions[0], helper:false},
                {name: 'orcid', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'viaf', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'myidref', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'linkedin', value: '', type: 'URL', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'viadeo', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'facebook', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'github', value: $scope.user.userId, type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper:false},
                {name: 'gravatar', value: $scope.user.email, type: 'EMAIL', source: '', visibility: $scope.visibilityOptions[0], helper:true},
                {name: 'langue_messages', value: 'fr', type: 'ENUM', source: 'lang', visibility: $scope.visibilityOptions[0], helper:false}
            ];

            ProfileResource.getSettings({userId: $scope.user.id}).$promise.then(function (settings) {
                $scope.user.settings = [];
                var result = [];
                angular.forEach(settings, function(settings) {
                    var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: settings.visibility});
                    var itemSetting = $filter('filter')($scope.settings, {name: settings.name});
                    var item = {name:settings.name, value:settings.value, type: settings.type, source: settings.source, visibility: visibilitySelected[0], helper: itemSetting[0].helper};
                    result.push(item);
                });

                if (result.length <= 0) {
                    $scope.user.settings = $scope.settings;
                } else {
                    angular.forEach($scope.settings, function(settings) {
                        var fieldName = settings.name;
                        var filledField = $filter('filter')(result, {name: fieldName});
                        if (filledField.length <= 0) {
                            $scope.user.settings.push(settings);
                        } else {
                            $scope.user.settings.push(filledField[0]);
                        }
                    });
                }

                console.debug('SETTINGS:', $scope.user.settings);
            });


            $scope.user.facebookId = ($filter('filter')($scope.user.avatarIds, {id: 1}))[0].value;
            //$scope.user.twitterId = ($filter('filter')($scope.user.avatarIds, {id: 2}))[0].value;
            $scope.user.githubId = ($filter('filter')($scope.user.avatarIds, {id: 3}))[0].value;
            $scope.user.gravatarId = ($filter('filter')($scope.user.avatarIds, {id: 4}))[0].value;

            /**
             * METHODS
             */

            $scope.showValue = function (name, value, source) {

                if(name === 'avatar') {
                    var selected = $filter('filter')($scope.user.avatarIds, {id: $scope.user.favoriteAvatar});
                    return ($scope.user.favoriteAvatar && selected.length) ? selected[0].name : 'Default avatar';

                } else {
                    var item = $filter('filter')($scope[source], {value: value});
                    if (item.length <= 0) {
                        return 'empty';
                    } else {
                        return item[0].text;
                    }
                }
            };

            $scope.updateCurrentUser = function (name, value, type, source, visibility) {
                $scope.user.name = $scope.user.firstname + ' ' + $scope.user.lastname;
                $scope.$parent.currentUser = User.load($scope.user);

                if( name === 'avatar') {
                    angular.forEach($scope.user.avatarIds, function(avatarId){
                        if( avatarId.id  === $scope.user.favoriteAvatar) {
                            avatarId.value = value;
                        }
                    });
                }

                var formData = {
                    name: name,
                    value: value,
                    type: type,
                    source: source,
                    visibility: visibility
                };

                ProfileResource.updateSettings({userId: $scope.user.id}, formData);
            };
        }
    ]);
