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
                    if (representation.values) {
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

                // var fields = {
                //     metaLatestSnapshot: 'key',
                //     metaRating: 'score:rank,.esrAccessibility',
                //     metaItem: 'title,type,image,publicationDate',
                //     metaWorkspace: 'wskey,wsalias,snapshotName'
                // };
                var params = {};
                // params[Helper.prefix.metaItem + 'title'] = '';
                // params[Helper.prefix.metaRating + 'score'] = '4';
                // params[Helper.prefix.workspace + 'archive'] = 'false';
                // params.fields = Helper.getFieldsParam(fields);
                // params.limit = '15';
                // params.orderProp = 'publicationDate';
                // params.orderDir = 'desc';
                params.index = 'item';
                $scope.paramsRecents = angular.toJson(params);
            }());

        }]);
