'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', ['Content', 'Settings',  function (Content, Settings) {
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

                    function getValue(multilingualProperty) {
                        var i;
                        for (i = 0; i < multilingualProperty.length; i++) {
                            if (multilingualProperty[i].lang === Settings.language) {
                                return multilingualProperty[i].value;
                            }
                        }
                        return multilingualProperty.length > 0 ? multilingualProperty[0].value : undefined;
                    }

                    if (scope.entry.applicationUrl) {
                        scope.itemUrl = scope.entry.applicationUrl;
                    } else {
                        var type;
                        if (scope.entry.type === 'Corpus') {
                            type = 'corpora';
                        } else if (scope.entry.type === 'Lexique') {
                            type = 'lexicons';
                        } else if (scope.entry.type === 'Outil') {
                            type = 'tools';
                        }
                        scope.itemUrl = '#/market/' + type + '/' + scope.entry.alias;
                    }

                    if (scope.entry.title) {
                        scope.title = getValue(scope.entry.title, Settings.language);
                    }
                    if (scope.entry.description) {
                        scope.description = getValue(scope.entry.description, Settings.language);
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
