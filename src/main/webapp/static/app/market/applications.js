'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'SearchProvider', 'Helper', function ($scope, SearchProvider, Helper) {

        (function init() {
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            var fields = {
                metaLatestSnapshot: 'key',
                metaRating: 'score:rank,.esrAccessibility',
                metaItem: 'title,type,image,publicationDate',
                metaWorkspace: 'wskey,wsalias,snapshotName'
            };
            var params = {};
            params[Helper.prefix.metaItem + 'type'] = 'Application';
            params.fields = Helper.getFieldsParam(fields);
            $scope.params = angular.toJson(params);
        }());

    }]);
