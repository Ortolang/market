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
                        if (scope.entry.type === 'Corpus') {
                            type = 'corpora';
                        } else if (scope.entry.type === 'Lexique') {
                            type = 'lexicons';
                        } else if (scope.entry.type === 'Outil') {
                            type = 'tools';
                        } else if (scope.entry.type === 'Application') {
                            type = 'applications';
                        }
                        scope.itemUrl = '/market/' + type + '/' + scope.entry.alias;

                    if (scope.entry.title) {
                        scope.title = Helper.getMultilingualValue(scope.entry.title);
                    }
                    if (scope.entry.description) {
                        scope.description = Helper.getMultilingualValue(scope.entry.description);
                    }

                    if (scope.entry.image) {
                        scope.image = Content.getContentUrlWithPath(scope.entry.image, scope.entry.alias, scope.entry.snapshotName);
                    } else {
                        scope.imgtitle = '';
                        scope.imgtheme = 'custom';
                        if (scope.title) {
                            scope.imgtitle = scope.title.substring(0, 2);
                            scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                        }
                    }
                }
            }
        };
    }]);
