'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', '$window', 'User', '$rootScope', '$translate', '$http',
        function ($scope, $routeParams, ProfileResource, $filter, $window, User, $rootScope, $translate, $http) {


            /*
             * Route
             */
            $scope.section = $routeParams.section;

            /*
             * INIT
             */

            function init() {

                $scope.visibilityOptions = [];

                $scope.visibilityOptions = [
                    {value: 'EVERYBODY', label: $translate.instant('PROFILE.VISIBILITY.EVERYBODY'), icon: 'fa fa-unlock'},
                    {value: 'FRIENDS', label: $translate.instant('PROFILE.VISIBILITY.FRIENDS'), icon: 'fa fa-users'},
                    {value: 'NOBODY', label: $translate.instant('PROFILE.VISIBILITY.NOBODY'), icon: 'fa fa-lock'}
                ];
                $scope.selectedVisibility = $scope.visibilityOptions[0];

                $scope.lang = [
                    {value: 'fr', text: $translate.instant('NAV.LANGUAGE.FRENCH')},
                    {value: 'en', text: $translate.instant('NAV.LANGUAGE.ENGLISH')}
                ];

                $scope.civilities = [
                    {value: 'Mme', text: $translate.instant('PROFILE.CIVILITY.MISSUS')},
                    {value: 'M', text: $translate.instant('PROFILE.CIVILITY.MISTER')}
                ];

                $http.get('profile/countries.json')
                    .then(function(res){
                        $scope.countries = res.data;
                    });

                $http.get('profile/states.json')
                    .then(function(res){
                        $scope.states = res.data;
                    });

                $scope.avatars = [
                    {value: 1, text: 'Facebook'},
                    //{value: 2, text: 'Twitter'},
                    {value: 3, text: 'GitHub'},
                    {value: 4, text: 'Gravatar'}
                ];


                $scope.user = undefined;

                $scope.user = $scope.$parent.currentUser;

                //ProfileResource.getFriends({userId: $scope.user.id}).$promise.then(function (friends) {
                //    $scope.friends = friends;
                //});
            }

            init();

            /**
             * RESIZE CONTAINER
             */

            $scope.resize = function () {
                //console.debug('Resizing');
                var profileContainerHeight = angular.element('#profile-container').outerHeight();
                //console.debug('new height : ', profileContainerHeight);
                angular.element('#main-wrapper').css({'height': profileContainerHeight + 'px'});
            };

            $scope.$watch(
                function() {
                    return angular.element('#profile-content').outerHeight();
                },
                function(newValue, oldValue) {
                    if(newValue !== oldValue) {
                        $scope.resize();
                    }
                }
            );

            angular.element($window).bind('resize', function () {
                $scope.resize();
            });
        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
