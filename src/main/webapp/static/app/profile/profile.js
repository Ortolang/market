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

                $http.get('profile/resources/fields.json')
                    .then(function(res){
                        $scope.fields = res.data;
                    });

                $scope.visibilityOptions = [];

                $scope.visibilityOptions = [
                    {value: 0, label: $translate.instant('PROFILE.VISIBILITY.EVERYBODY'), icon: 'fa fa-unlock'},
                    {value: 1, label: $translate.instant('PROFILE.VISIBILITY.FRIENDS'), icon: 'fa fa-users'},
                    {value: 2, label: $translate.instant('PROFILE.VISIBILITY.NOBODY'), icon: 'fa fa-lock'}
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

                $http.get('profile/resources/countries.json')
                    .then(function(res){
                        $scope.countries = res.data;
                    });

                $http.get('profile/resources/states.json')
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

            }

            init();


            /**
             * RESIZE CONTAINER
             */

            $scope.resize = function () {
                //console.log('Resizing');
                var profileContainerHeight = angular.element('#profile-container').outerHeight();
                //console.log('new height : ', profileContainerHeight);
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
