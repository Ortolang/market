'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:searchPanel
 * @description
 * # searchPanel
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('searchPanel', {
        bindings: {
            wskey: '@?',
        },
        controller: ['$scope', '$location', 'SearchResource',
            function ($scope, $location, SearchResource) {
                var ctrl = this;

                ctrl.search = function () {
                    $location.search({content: ctrl.text});
                    SearchResource.content({ 'content*': ctrl.text, 'highlight': 'content', 'workspace.key.keyword': ctrl.wskey }, function (hits) {
                        ctrl.hits = hits.hits;
                    });
                };

                $scope.$on('$routeUpdate', function () {
                    refresh();
                });

                ctrl.$onInit = function () {
                    ctrl.hits = [];
                    refresh();
                };

                function refresh() {
                    ctrl.text = $location.search().content ? $location.search().content : '';
                    if ($location.search().content) {
                        ctrl.search();
                    }
                }

            }
        ],
        templateUrl: 'market/components/search-panel.component.html'
    });