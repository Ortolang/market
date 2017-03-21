'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', 'SearchProvider', 'StaticWebsite', 'StatisticsResource', 'Helper',
        function ($scope, SearchProvider, StaticWebsite, StatisticsResource, Helper) {

            StatisticsResource.get({names: 'core.workspaces.all,membership.profiles.all,binary-store.size,binary-store.files'}, function (data) {
                angular.forEach(data, function (representation, name) {
                    if (representation.values && representation.values.length>0) {
                        $scope.statistics[name] = representation.values.pop()[1];
                    }
                });
            });

            function initScopeVariables() {
                $scope.statistics = {};
                $scope.StaticWebsite = StaticWebsite;
                $scope.staticWebsiteBase = StaticWebsite.getStaticWebsiteBase();
            }

            (function init() {
                initScopeVariables();
                $scope.searchRecents = SearchProvider.make();
                $scope.searchRecents.setActiveOrderProp('rank', true);

                var params = {};
                params.includes = Helper.includedItemFields;
                params.size = '15';
                params.orderProp = 'publicationDate';
                params.orderDir = 'desc';
                params.rank = '4';
                params.archive = false;
                $scope.paramsRecents = angular.toJson(params);
            }());

        }]);
