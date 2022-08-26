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
        controller: ['$scope', '$location', 'SearchResource', '$translate', 'SearchPanelConfig',
            function ($scope, $location, SearchResource, $translate, SearchPanelConfig) {
                var ctrl = this;

                function doSearchContent() {
                    var query = {};
                    query[SearchPanelConfig.FIELDS.WORKSPACE_KEY] = ctrl.wskey;
                    query[SearchPanelConfig.FIELDS.HIGHLIGHT_NUMOFFRAGMENTS] = ctrl.selectedNumOfFragments;
                    query[SearchPanelConfig.FIELDS.HIGHLIGHT_FIELDS] = SearchPanelConfig.HIGHLIGHT_FIELDS.CONTENT;
                    query[SearchPanelConfig.FIELDS.INCLUDES] = [
                            SearchPanelConfig.HIGHLIGHT_FIELDS.NAME, 
                            SearchPanelConfig.HIGHLIGHT_FIELDS.PID,
                            SearchPanelConfig.HIGHLIGHT_FIELDS.KEY
                        ];
                    query[SearchPanelConfig.FIELDS.SIZE] = SearchPanelConfig.MAX_NB_DOCUMENTS;
                    query[SearchPanelConfig.HIGHLIGHT_FIELDS.CONTENT + ctrl.selectedSearchType] = ctrl.text;
                    ctrl.ready = false;
                    SearchResource.content(query, function (hits) {
                        ctrl.hits = hits.hits;
                        ctrl.totalHits = hits.totalHits;
                        ctrl.tookInMillis = hits.tookInMillis;
                        ctrl.ready = true;
                    });
                }

                ctrl.search = function () {
                    $location.search({content: ctrl.text, searchtype: ctrl.selectedSearchType, numOfFragments: ctrl.selectedNumOfFragments});
                };

                $scope.$on('$routeUpdate', function () {
                    refresh();
                });

                ctrl.$onInit = function () {
                    ctrl.hits = [];
                    ctrl.totalHits = 0;
                    ctrl.tookInMillis = 0;
                    ctrl.searchTypes = [
                        {
                            'key': SearchPanelConfig.SEARCH_TYPES.MATCH,
                            'value': $translate.instant('SEARCH_TYPES.MATCH')
                        },
                        {
                            'key': SearchPanelConfig.SEARCH_TYPES.MATCH_PHRASE_PREFIX,
                            'value': $translate.instant('SEARCH_TYPES.MATCH_PHRASE_PREFIX')
                        },
                        {
                            'key': SearchPanelConfig.SEARCH_TYPES.REGEX,
                            'value': $translate.instant('SEARCH_TYPES.REGEX')
                        }
                    ];
                    ctrl.selectedSearchType = SearchPanelConfig.SEARCH_TYPES.MATCH;
                    ctrl.selectedNumOfFragments = SearchPanelConfig.NUM_OF_FRAGMENTS;
                    ctrl.numOfFragmentsList = [
                        { key: '5', value: $translate.instant('MARKET.SEARCH_PANEL.FIVE_FRAGMENTS') },
                        { key: '25', value: $translate.instant('MARKET.SEARCH_PANEL.TWENTY_FIVE_FRAGMENTS') },
                        { key: '50', value: $translate.instant('MARKET.SEARCH_PANEL.FIFTY_FRAGMENTS') },
                        { key: '100', value: $translate.instant('MARKET.SEARCH_PANEL.HUNDRED_FRAGMENTS') },
                    ];
                    ctrl.ready = null;
                    refresh();
                };

                function refresh() {
                    ctrl.text = $location.search().content ? $location.search().content : '';
                    ctrl.selectedSearchType = $location.search().searchtype ? $location.search().searchtype : SearchPanelConfig.SEARCH_TYPES.MATCH;
                    ctrl.selectedNumOfFragments = $location.search().numOfFragments ? $location.search().numOfFragments : SearchPanelConfig.NUM_OF_FRAGMENTS;
                    if ($location.search().content) {
                        doSearchContent();
                    }
                }

            }
        ],
        templateUrl: 'market/components/search-panel.component.html'
    });