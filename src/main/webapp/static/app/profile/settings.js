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
            var category = 'settings';

            $scope.user.facebookId = ($filter('filter')($scope.user.avatarIds, {id: 1}))[0].value;
            //$scope.user.twitterId = ($filter('filter')($scope.user.avatarIds, {id: 2}))[0].value;
            $scope.user.githubId = ($filter('filter')($scope.user.avatarIds, {id: 3}))[0].value;
            $scope.user.gravatarId = ($filter('filter')($scope.user.avatarIds, {id: 4}))[0].value;


            ProfileResource.getInfos({userId: $scope.user.id}, category).$promise.then(function (settings) {
                $scope.user.settings = [];
                var result = [];
                if (settings.size > 0) {
                    angular.forEach(settings.entries, function (setting) {
                        var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: setting.visibility}, true);
                        var settingName = setting.name.split('.')[1];
                        var itemSetting = $filter('filter')($scope.fields[category], {name: settingName}, true);
                        if (itemSetting.length > 0) {
                            var item = {
                                name: settingName,
                                value: setting.value,
                                type: setting.type,
                                source: setting.source,
                                visibility: visibilitySelected[0],
                                helper: itemSetting[0].helper
                            };
                            result.push(item);
                        }
                    });
                }

                if (result.length <= 0) {
                    // Initialisation des champs
                    angular.forEach($scope.fields[category], function( setting ){
                        var item = setting;
                        item.visibility = $scope.visibilityOptions[0];
                        if(item.name === 'github') {
                            item.value = $scope.user.userId;
                        }
                        if(item.name === 'gravatar') {
                            item.value = $scope.user.email;
                        }
                        $scope.user.settings.push(item);
                    });
                } else {
                    // Initialisation des champs
                    angular.forEach($scope.fields[category], function (setting) {
                        var fieldName = setting.name, item;
                        var filledField = $filter('filter')(result, {name: fieldName}, true);
                        if (filledField.length <= 0) {
                            item = setting;
                            item.visibility = $scope.visibilityOptions[0];
                            if(item.name === 'github') {
                                item.value = $scope.user.userId;
                            }
                            if(item.name === 'gravatar') {
                                item.value = $scope.user.email;
                            }
                        } else {
                            item = filledField[0];
                        }
                        $scope.user.settings.push(item);

                        if (setting.name === 'avatar') {
                            $scope.user.favoriteAvatar = item.value;
                        }
                        angular.forEach($scope.user.avatarIds, function (avatarId, idx) {
                            if (avatarId.name === item.name) {
                                $scope.user.avatarIds[idx].value = item.value;
                            }
                        });
                    });
                }
            });

            /**
             * METHODS
             */

            $scope.showValue = function (name, value, source) {
                if(name === 'avatar') {
                    var selected = $filter('filter')($scope.user.avatarIds, {id: String(value)}, true);mm
                    return (value && selected.length) ? selected[0].name : 'Default avatar';

                } else {
                    var item = $filter('filter')($scope[source], {value: value}, true);
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
                    $scope.user.favoriteAvatar = value;
                } else {
                    angular.forEach( $scope.user.avatarIds, function(avatarId) {
                       if (avatarId.name === name) {
                           avatarId.value = value;
                       }
                    });
                }

                var formData = {
                    name: category + '.' + name,
                    value: value,
                    type: type,
                    source: source,
                    visibility: visibility
                };

                //console.debug(formData);
                ProfileResource.update({userId: $scope.user.id}, formData);
            };
        }
    ]);
