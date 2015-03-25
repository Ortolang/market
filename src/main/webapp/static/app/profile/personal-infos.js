'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PersonalInfosCtrl
 * @description
 * # PersonalInfosCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PersonalInfosCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', 'User',
        function ($scope, $routeParams, ProfileResource, $filter, User) {

            /**
             * INIT
             */
            var category = 'infos';

            ProfileResource.getInfos({userId: $scope.user.id}, category).$promise.then(function (infos) {
                $scope.user.infos = [];
                var result = [];
                if(infos.size > 0 ) {
                    angular.forEach(infos.entries, function (info) {
                        var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: info.visibility}, true);
                        var itemName = info.name.split('.')[1];
                        var itemInfo = $filter('filter')($scope.fields[category], {name: itemName}, true);
                        if (itemInfo.length > 0) {
                            var item = {
                                name: itemName,
                                value: info.value,
                                type: info.type,
                                source: info.source,
                                visibility: visibilitySelected[0],
                                helper: itemInfo[0].helper
                            };
                            result.push(item);
                        }
                    });
                }

                if (result.length <= 0) {
                    // Initialisation des champs
                    angular.forEach($scope.fields[category], function( info ){
                        var item = info;
                        item.visibility = $scope.visibilityOptions[0];
                        if(item.name === 'prenom') {
                            item.value = $scope.user.firstname;
                        }
                        if(item.name === 'nom') {
                            item.value = $scope.user.lastname;
                        }
                        if(item.name === 'mail_pro') {
                            item.value = $scope.user.email;
                        }
                        $scope.user.infos.push(item);
                    });
                } else {
                    // Initialisation des champs
                    angular.forEach($scope.fields[category], function(info) {
                        var fieldName = info.name;
                        var filledField = $filter('filter')(result, {name: fieldName}, true);
                        if (filledField.length <= 0) {
                            var item = info;
                            item.visibility = $scope.visibilityOptions[0];
                            if(item.name === 'prenom') {
                                item.value = $scope.user.firstname;
                            }
                            if(item.name === 'nom') {
                                item.value = $scope.user.lastname;
                            }
                            if(item.name === 'mail_pro') {
                                item.value = $scope.user.email;
                            }
                            $scope.user.infos.push(item);
                        } else {
                            $scope.user.infos.push(filledField[0]);
                        }
                    });
                }

            });

            /**
             * METHODS
             */

            $scope.showValue = function (value, source) {
                var item = $filter('filter')($scope[source], {value: value}, true);
                if (item === undefined || item.length <= 0 ) {
                    return 'empty';
                } else {
                    return item[0].text;
                }
            };


            $scope.updateCurrentUser = function (name, value, type, source, visibility) {
                $scope.user.name = $scope.user.firstname + ' ' + $scope.user.lastname;
                $scope.$parent.currentUser = User.load($scope.user);

                var formData = {
                    name: category + '.' + name,
                    value: value,
                    type: type,
                    source: source,
                    visibility: visibility
                };

                ProfileResource.update({userId: $scope.user.id}, formData);
            };
        }
    ]);
