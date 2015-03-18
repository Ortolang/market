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
            $scope.aboutMe = [
                {name: 'presentation', value: '', type: 'TEXT', source: '', visibility: $scope.visibilityOptions[0], helper: false}
            ];

            $scope.user.presentation = undefined;
            ProfileResource.getPresentation({userId: $scope.user.id, name: 'presentation'}).$promise.then(function (aboutmeList) {
                var presentation;
                if(aboutmeList.length > 0) {
                    angular.forEach(aboutmeList, function (aboutme) {
                        var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: aboutme.visibility}, true);
                        var itemInfo = $filter('filter')($scope.aboutMe, {name: aboutme.name}, true);
                        if (itemInfo.length > 0) {
                            presentation = {
                                name: aboutme.name,
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
                    $scope.user.presentation = $scope.aboutMe[0];
                }
            });

            /**
             * METHODS
             */

            $scope.updateCurrentUser = function (name, value, type, source, visibility) {
                $scope.user.name = $scope.user.firstname + ' ' + $scope.user.lastname;
                $scope.$parent.currentUser = User.load($scope.user);

                var formData = {
                    name: name,
                    value: value,
                    type: type,
                    source: source,
                    visibility: visibility
                };

                ProfileResource.updatePresentation({userId: $scope.user.id}, formData);
            };
        }
    ]);
