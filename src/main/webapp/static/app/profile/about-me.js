'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AboutMeCtrl
 * @description
 * # AboutMeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AboutMeCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', 'User',
        function ($scope, $routeParams, ProfileResource, $filter, User) {

            /**
             * INIT
             */
            var category = 'aboutme';

            $scope.user.presentation = undefined;
            ProfileResource.getInfos({userId: $scope.user.id}, category).$promise.then(function (aboutmeList) {
                var presentation;
                if(aboutmeList.size > 0) {
                    angular.forEach(aboutmeList.entries, function (aboutme) {
                        var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: aboutme.visibility}, true);
                        var aboutmeName = aboutme.name.split('.')[1];
                        var itemInfo = $filter('filter')($scope.fields[category], {name: aboutmeName}, true);
                        if (itemInfo.length > 0) {
                            presentation = {
                                name: aboutmeName,
                                value: aboutme.value,
                                type: aboutme.type,
                                source: aboutme.source,
                                visibility: visibilitySelected[0],
                                helper: itemInfo[0].helper
                            };
                            $scope.user.presentation = presentation;
                        }
                    });
                }

                if ($scope.user.presentation === undefined) {
                    // Initialisation du champ
                    var item = $scope.fields[category][0];
                    item.visibility = $scope.visibilityOptions[0];

                    $scope.user.presentation = item;
                }
            });

            /**
             * METHODS
             */

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
