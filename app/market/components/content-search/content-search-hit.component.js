'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:contentSearchHit
 * @description
 * # contentSearchHit
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('contentSearchHit', {
        bindings: {
            hit: '=',
            selectedNumOfFragments: '@?'
        },
        controller: ['VisualizerService',
            function (VisualizerService) {
                var ctrl = this;

                ctrl.displayMoreFragments = function() {
                    ctrl.maxHit = ctrl.selectedNumOfFragments;
                }

                ctrl.displayFilePreview = function () {
                    VisualizerService.showPreview(ctrl.hit.source.key);
                }

                ctrl.$onInit = function () {
                    ctrl.maxHit = 1;
                }
            }
        ],
        templateUrl: 'market/components/content-search/content-search-hit.component.html'
    });