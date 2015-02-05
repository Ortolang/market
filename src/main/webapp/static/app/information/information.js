'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:InformationCtrl
 * @description
 * # InformationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('InformationCtrl', ['$scope', '$translate', '$rootScope',
        function ($scope, $translate, $rootScope) {

            $scope.showContent = function (language) {
                $scope.contentLegalNotices = 'information/templates/legal_notices.'+ language +'.html';
                $scope.contentAbstract = 'information/templates/abstract.'+ language +'.html';
                $scope.contentPresentation = 'information/templates/presentation.'+ language +'.html';
                $scope.contentRoadmap = 'information/templates/roadmap.' + language + '.html';

            };

            $rootScope.$on('$translateChangeSuccess', function (e, data) {
                $scope.showContent(data.language);
            });

            $scope.showContent($translate.use());

        }
    ]);
