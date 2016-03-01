'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', ['Content', 'Helper',  function (Content, Helper) {
        return {
            restrict: 'EA',
            scope: {
                entry: '='
            },
            templateUrl: function (element, attr) {
                return attr.template;
            },
            link: {
                pre : function (scope) {

                        var type;
                        if (scope.entry['meta_ortolang-item-json'].type === 'Corpus') {
                            type = 'corpora';
                        } else if (scope.entry['meta_ortolang-item-json'].type === 'Lexique') {
                            type = 'lexicons';
                        } else if (scope.entry['meta_ortolang-item-json'].type === 'Outil') {
                            type = 'tools';
                        } else if (scope.entry['meta_ortolang-item-json'].type === 'Application') {
                            type = 'applications';
                        }
                        scope.itemUrl = '/market/' + type + '/' + scope.entry['meta_ortolang-workspace-json'].wsalias;

                    if (scope.entry['meta_ortolang-item-json'].title) {
                        scope.title = Helper.getMultilingualValue(scope.entry['meta_ortolang-item-json'].title);
                    }
                    if (scope.entry['meta_ortolang-item-json'].description) {
                        scope.description = Helper.getMultilingualValue(scope.entry['meta_ortolang-item-json'].description);
                    }

                    if (scope.entry['meta_ortolang-item-json'].image) {
                        scope.image = Content.getPreviewUrlWithPath(scope.entry['meta_ortolang-item-json'].image, scope.entry['meta_ortolang-workspace-json'].wsalias, scope.entry['meta_ortolang-workspace-json'].snapshotName, 160);
                    } else {
                        scope.imgtitle = '';
                        scope.imgtheme = 'custom';
                        if (scope.title) {
                            scope.imgtitle = scope.title.substring(0, 2);
                            scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                        }
                    }

                    scope.publicationDate = scope.entry['meta_ortolang-item-json'].publicationDate;
                    scope.producers = scope.entry['meta_ortolang-item-json'].producers;
                }
            }
        };
    }]);
