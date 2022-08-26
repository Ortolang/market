'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', '$location', 'SearchProvider', 'StaticWebsite', 'StatisticsResource', 'Helper',
        function ($scope, $location, SearchProvider, StaticWebsite, StatisticsResource, Helper) {

            $scope.goToSearch = function() {
                $location.search({content: $scope.content});
                $location.path("/market/search");
            };

            $scope.seeMore = function (value) {
                $location.path("/market/" + value);
            };

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
                // Corpora
                $scope.searchCorpora = SearchProvider.make();
                $scope.searchCorpora.setActiveOrderProp('rank', true);
                $scope.paramsCorpora = { type: 'Corpus', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };
                // Lexicons
                $scope.searchLexicons = SearchProvider.make();
                $scope.searchLexicons.setActiveOrderProp('rank', true);
                $scope.paramsLexicons = { type: 'Lexique', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };
                // Terminology
                $scope.searchTerminologies = SearchProvider.make();
                $scope.searchTerminologies.setActiveOrderProp('rank', true);
                $scope.paramsTerminologies = { type: 'Terminologie', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };
                // Tools
                $scope.searchTools = SearchProvider.make();
                $scope.searchTools.setActiveOrderProp('rank', true);
                $scope.paramsTools = { type: 'Outil', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };
            }());

        }]);
