'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', ['$translate', 'Content', 'Helper', 'icons', function ($translate, Content, Helper, icons) {
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
                    scope.icons = icons;
                    var type;
                    if (scope.entry.type === 'Corpus') {
                        type = 'corpora';
                    } else if (scope.entry.type === 'Lexique') {
                        type = 'lexicons';
                    } else if (scope.entry.type === 'Outil') {
                        type = 'tools';
                    } else if (scope.entry.type === 'Application') {
                        type = 'applications';
                    } else if (scope.entry.type === 'Terminologie') {
                        type = 'terminologies';
                    }
                    scope.itemUrl = '/market/' + type + '/' + scope.entry.alias;

                    if (scope.entry.effectiveTitle) {
                        scope.title = scope.entry.effectiveTitle;
                    }
                    if (scope.entry.description) {
                        var description = Helper.findObjectOfArray(scope.entry.description, "lang", "fr");
                        if (description == null) {
                            description = Helper.findObjectOfArray(scope.entry.description, "lang", "en");
                        }
                        if (angular.isDefined(description.abstract)) {
                            scope.description = description.abstract;
                        }
                    }
                    if (scope.entry.type) {
                        scope.type = scope.entry.type;
                        scope.typeIcon = icons.suggestion[scope.entry.type.toLowerCase()];
                    }

                    if (scope.entry.image) {
                        scope.image = Content.getThumbUrlWithPath(scope.entry.image, scope.entry.alias, scope.entry.tag, 160, true);
                    } else {
                        scope.imgtitle = '';
                        scope.imgtheme = 'custom';
                        if (scope.title) {
                            scope.imgtitle = scope.title.substring(0, 2);
                            scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                        }
                    }

                    if (scope.entry.corporaType) {
                        scope.corporaType = Helper.getMultilingualValue(scope.entry.corporaType.labels);
                    }
                    if (scope.entry.statusOfUse) {
                        scope.statusOfUse = Helper.getMultilingualValue(scope.entry.statusOfUse.labels);
                    }

                    // For sorting
                    scope.publicationDate = scope.entry.publicationDate;
                    scope.effectiveRank = scope.entry.effectiveRank;
                    scope.effectiveTitle = scope.entry.effectiveTitle;
                }
            }
        };
    }]);
