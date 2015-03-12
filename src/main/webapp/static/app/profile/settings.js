'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SettingsCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter',
        function ($scope, $routeParams, ProfileResource, $filter) {

            /**
             * INIT
             */
            $scope.settings = [,
                {name: 'orcid', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'viaf', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'myidref', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'linkedin', value: '', type: 'URL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'viadeo', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'langue_messages', value: 'fr', type: 'ENUM', source: 'lang', visibility: $scope.visibilityOptions[0]}
            ];

            $scope.user.facebookId = ($filter('filter')($scope.user.avatarIds, {id: 1}))[0].value;
            //$scope.user.twitterId = ($filter('filter')($scope.user.avatarIds, {id: 2}))[0].value;
            $scope.user.githubId = ($filter('filter')($scope.user.avatarIds, {id: 3}))[0].value;
            $scope.user.gravatarId = ($filter('filter')($scope.user.avatarIds, {id: 4}))[0].value;

            $scope.showfavoriteAvatar = function(data) {
                var selected = $filter('filter')($scope.user.avatarIds, {id: $scope.user.favoriteAvatar});
                return ($scope.user.favoriteAvatar && selected.length) ? selected[0].name : 'Default avatar';
            };

            $scope.updateUserAvatar = function(field, data) {
                angular.forEach($scope.user.avatarIds, function(avatarId){
                    if( avatarId.id  === $scope.user.favoriteAvatar) {
                        avatarId.value = data;
                    }
                });
                //post data
            };
        }
    ]);
