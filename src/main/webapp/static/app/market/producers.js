'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Producers
 * @description
 * # Producers
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducersCtrl', ['$scope', 'icons', 'QueryBuilderFactory', 'ItemManager', 'JsonResultResource', function ($scope, icons, QueryBuilderFactory, ItemManager, JsonResultResource) {

        $scope.search = function() {
            var query = buildQuery();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                $scope.producers.clear();

                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);

                    if(jsEntry.producers) {
                        angular.forEach(jsEntry.producers, function(producer) {
                            if(!$scope.producers.exists(producer)) {
                                $scope.producers.addItem(producer);
                            }
                        });
                    }
                });
            }, function (reason) {
                console.error(reason);
            });
        };

        function buildQuery() {
            var queryBuilder = QueryBuilderFactory.make({
                    projection: '*, meta_ortolang-item-json.producers as producers',
                    source: 'collection'
                });

                queryBuilder.equals('status', 'published');

                // var contentSplit = [];
                // if (content && content !== '') {
                //     contentSplit = queryBuilder.tokenize(content);
                // }
                // if (contentSplit.length > 0) {
                //     angular.forEach(contentSplit, function (contentPart) {
                //         queryBuilder.and();
                //         queryBuilder.containsText('any()', contentPart);
                //     });
                // }

                // angular.forEach(this.enabledFilters, function(filter) {
                //     queryBuilder.and();
                //     if(filter.getType() ==='array') {
                //         queryBuilder.in(filter.getId(), filter.getSelectedOptionsValues());
                //     } else {
                //         queryBuilder.equals(filter.getId(), filter.getSelectedOptionsValues());
                //     }
                // });

                return queryBuilder.toString();
        }

        function initScopeVariables() {
    		// $scope.query = '';
    		$scope.producers = ItemManager.make();

      //       var viewModeLine = {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'};
      //       var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
      //       $scope.viewModes = [viewModeGrid, viewModeLine];
    		// $scope.viewMode = viewModeGrid;

            // $scope.orderDirection = true;
            // var orderTitle = {id: 'title', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'};
            // var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            // $scope.orderProps = [orderTitle, orderPublicationDate];
            // $scope.orderProp = orderPublicationDate;
        }

        function init() {
        	initScopeVariables();

            $scope.search();
        }
        init();

	}]);