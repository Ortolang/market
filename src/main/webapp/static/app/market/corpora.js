'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:CorporaCtrl
 * @description
 * # CorporaCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', '$filter', 'icons', 'JsonResultResource', 'QueryBuilderService', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, $rootScope, $routeParams, $location, $window, $filter, icons, JsonResultResource, QueryBuilderService, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        $scope.clickItem = function (entry) {
            if (entry.applicationUrl) {
                $window.open(entry.applicationUrl);
            } else {
                $location.path('/market/item/' + entry.key);
            }
        };

        $scope.search = function (content) {
            if (content !== '') {
                $location.url('/search?content='+content+'&type=Corpus');
            }
        };


        function load () {
            var queryBuilder = QueryBuilderService.make({
                projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl', 
                source: 'collection'
            });

            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.equals('meta_ortolang-item-json.type', 'Corpus');

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);
                    $scope.items.push(jsEntry);
                });
            }, function (reason) {
                console.error(reason);
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
        }

        function init() {
            initScopeVariables();

            load();
        }
        init();

    }]);
