'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:InformationCtrl
 * @description
 * # InformationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('InformationCtrl', ['$scope', '$rootScope', '$routeParams', '$route', '$location', '$anchorScroll', 'StaticWebsite',
        function ($scope, $rootScope, $routeParams, $route, $location, $anchorScroll, StaticWebsite) {

            $scope.StaticWebsite = StaticWebsite;

            $scope.goToAnchor = function (newHash) {
                if ($location.hash() !== newHash) {
                    $location.hash(newHash);
                } else {
                    $anchorScroll();
                }
            };

            if (!$routeParams.section) {
                if (StaticWebsite.getInformationContent()) {
                    $route.updateParams({section: StaticWebsite.getInformationContent()[0].id});
                } else {
                    $rootScope.$on('informationPagePopulated', function () {
                        $route.updateParams({section: StaticWebsite.getInformationContent()[0].id});
                    });
                }
                $route.updateParams({section: StaticWebsite.getInformationContent() ? StaticWebsite.getInformationContent()[0].id : 'presentation'});
            } else {
                $scope.section = $routeParams.section;
            }

        }]);
