'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ortolangItemJsonPreview
 * @description
 * # ortolangItemJsonPreview
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('ortolangItemJsonPreview', ['$rootScope', '$filter', '$location', 'Settings', 'Content', '$translate', function ($rootScope, $filter, $location, Settings, Content, $translate) {
        return {
            restrict: 'EA',
            scope: {
                content: '=',
                alias: '=',
                ortolangObject: '=',
                itemKey: '=',
                root: '=',
                tag: '=',
                tags: '=',
                browse: '=',
                icons: '=',
                preview: '@?'
            },
            template: '<div ng-include="marketItemTemplate"></div>',
            link: {
                pre: function (scope) {

                    function loadItem() {

                        if (!scope.preview) {
                            $rootScope.ortolangPageTitle = getValue(scope.content.title, 'lang', Settings.language, 'Untitled') + ' | ';
                        }

                        if (scope.content.schema) {

                            if ($location.search().path) {
                                scope.browse = true;
                            }

                            if (scope.content.schema === 'http://www.ortolang.fr/schema/013#') {
                                scope.marketItemTemplate = 'market/templates/ortolang-item-json-13.html';

                                refreshMultilingualValue(scope.content, Settings.language);
                                scope.itemMarketType = getItemType(scope.content);

                                if (scope.content.image) {
                                    scope.image = Content.getPreviewUrlWithPath(scope.content.image, scope.alias, scope.root, 180);
                                } else {
                                    scope.imgtitle = '';
                                    scope.imgtheme = 'custom';
                                    if (scope.title) {
                                        scope.imgtitle = scope.title.substring(0, 2);
                                        scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                                    }
                                }

                                if (scope.content.datasize !== undefined && scope.content.datasize !== '') {
                                    scope.datasizeToPrint = {'value': $filter('bytes')(scope.content.datasize)};
                                }
                            } else if (scope.content.schema === 'http://www.ortolang.fr/schema/014#') {
                                scope.marketItemTemplate = 'market/templates/ortolang-item-json-14.html';

                                refreshMultilingualValue(scope.content, Settings.language);
                                scope.itemMarketType = getItemType(scope.content);

                                if (scope.content.image) {
                                    scope.image = Content.getPreviewUrlWithPath(scope.content.image, scope.alias, scope.root, 180);
                                } else {
                                    scope.imgtitle = '';
                                    scope.imgtheme = 'custom';
                                    if (scope.title) {
                                        scope.imgtitle = scope.title.substring(0, 2);
                                        scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                                    }
                                }

                                if (scope.content.datasize !== undefined && scope.content.datasize !== '') {
                                    scope.datasizeToPrint = {'value': $filter('bytes')(scope.content.datasize)};
                                }
                            } else {
                                scope.marketItemTemplate = 'market/templates/ortolang-item-json-unknown.html';
                            }

                        } else {
                            scope.marketItemTemplate = 'market/templates/ortolang-item-json-unknown.html';
                        }
                    }


                    function getValues(arr, propertyName, propertyValue) {
                        var values = [];
                        if (arr) {
                            var iObject;
                            for (iObject = 0; iObject < arr.length; iObject++) {
                                if (arr[iObject][propertyName] === propertyValue) {
                                    values.push(arr[iObject].value);
                                }
                            }
                        }
                        return values;
                    }

                    function getValue(arr, propertyName, propertyValue, defaultValue) {
                        var values = getValues(arr, propertyName, propertyValue);
                        if (arr && values.length === 0) {
                            return arr.length > 0 ? arr[0].value : defaultValue;
                        }
                        return values[0];
                    }

                    function refreshMultilingualValue(item, lang) {
                        scope.title = getValue(item.title, 'lang', lang, 'Untitled');
                        scope.description = getValue(item.description, 'lang', lang);
                        if (item.keywords) {
                            scope.keywords = getValues(item.keywords, 'lang', lang);
                            if (scope.keywords.length === 0) {
                                scope.keywords = getValues(item.keywords, 'lang', 'fr');
                            }
                        }
                        if (item.bibliographicCitation) {
                            scope.bibliographicCitation = getValue(item.bibliographicCitation, 'lang', lang);
                        }
                    }

                    scope.browseContent = function () {
                        scope.browse = !scope.browse;
                    };

                    scope.toggleDescription = function () {
                        scope.showingDescription = !scope.showingDescription;
                    };

                    scope.exportItem = function () {
                        Content.exportSingle(scope.alias, scope.root, '/', scope.alias);
                    };

                    scope.seeContributorPage = function (contributor) {
                        if (contributor.entity.id) {
                            $location.url('/contributors/' + contributor.entity.id);
                        }
                    };

                    function getItemType(item) {
                        switch (item.type) {
                            case 'Corpus':
                                return 'corpora';
                            case 'Lexique':
                                return 'lexicons';
                            case 'Application':
                                return 'applications';
                            case 'Outil':
                                return 'tools';
                        }
                    }

                    $rootScope.$on('$translateChangeSuccess', function () {
                        if (scope.content) {
                            refreshMultilingualValue(scope.content, $translate.use());
                        }
                    });

                    scope.$watch('content', function (newContent) {
                        if (scope.content !== undefined && scope.currentContent !== newContent) {
                            init();
                            scope.currentContent = newContent;
                        }
                    });

                    function initScopeVariables() {
                        // Show info, browse, ...
                        scope.marketItemTemplate = undefined;
                        scope.image = undefined;
                        scope.imgtitle = undefined;
                        scope.currentContent = scope.content;
                        scope.showingDescription = false;
                    }

                    function init() {
                        scope.initilizing = true;
                        initScopeVariables();
                        loadItem();
                        scope.initilizing = false;
                    }

                }
            }
        };
    }]);

