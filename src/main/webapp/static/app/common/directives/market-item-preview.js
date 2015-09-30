'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemPreview
 * @description
 * # marketItemPreview
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemPreview', ['$rootScope', '$filter', '$location', 'ObjectResource', 'Settings', 'Content', 'icons', '$translate', function ($rootScope, $filter, $location, ObjectResource, Settings, Content, icons, $translate) {
        return {
            restrict: 'EA',
            scope: {
                content: '=',
                alias: '=',
                ortolangObject: '=',
                itemKey: '=',
                root: '=',
                tags: '=',
                browse: '='
            },
            templateUrl: 'common/directives/market-item.html',
            link: {
                pre: function (scope) {

                    function loadItem() {

                        $rootScope.ortolangPageTitle = getValue(scope.content.title, 'lang', Settings.language, 'untitle');

                        if (scope.content.schema) {

                            scope.browse = $location.search().browse;
                            scope.preview = $location.search().preview;

                            if (scope.content.schema === 'http://www.ortolang.fr/schema/012#') {
                                scope.marketItemTemplate = 'market/templates/market-item-12.html';

                                refreshMultilingualValue(scope.content, Settings.language);

                                if (scope.content.image) {
                                    ObjectResource.element({key: scope.itemKey, path: scope.content.image}).$promise.then(function (oobject) {
                                        scope.image = Content.getContentUrlWithKey(oobject.key);
                                    }, function (reason) {
                                        console.error(reason);
                                    });
                                } else {
                                    scope.imgtitle = '';
                                    scope.imgtheme = 'custom';
                                    if (scope.title) {
                                        scope.imgtitle = scope.title.substring(0, 2);
                                        scope.imgtheme = scope.title.substring(0, 1).toLowerCase();
                                    }
                                }

                                if (scope.content.license !== undefined && scope.content.license !== '') {
                                    loadLicense(scope.itemKey, scope.content.license);
                                }

                                if (scope.content.datasize !== undefined && scope.content.datasize !== '') {
                                    scope.datasizeToPrint = {'value': $filter('bytes')(scope.content.datasize)};
                                }
                            } else {
                                //TODO show message like format metadata unknown
                            }

                        } else {
                            //TODO show message like format metadata unknown
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
                        scope.title = getValue(item.title, 'lang', lang, 'untitle');
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
                        if (item.publications) {
                            scope.primaryPublications = getValues(item.publications, 'priority', 'primary');
                        }
                        if (item.publications) {
                            scope.secondaryPublications = getValues(item.publications, 'priority', 'secondary');
                        }
                    }

                    function loadLicense(collection, licensePath) {
                        ObjectResource.element({key: collection, path: licensePath}).$promise.then(function (oobject) {
                            scope.licenseDataObject = oobject;
                        }, function (reason) {
                            console.error(reason);
                        });
                    }

                    scope.browseContent = function () {
                        scope.browse = !scope.browse;
                        if (scope.browse) {
                            $location.search('browse', true);
                        } else {
                            // Clear search parts by keeping only the path
                            $location.url($location.path());
                        }
                    };

                    scope.previewContent = function () {
                        scope.preview = !scope.preview;
                        if (scope.preview) {
                            $location.search('preview', true);
                        } else {
                            // Clear search parts by keeping only the path
                            $location.url($location.path());
                        }
                    };

                    scope.toggleDescription = function () {
                        scope.showingDescription = !scope.showingDescription;
                    };

                    scope.isProducer = function (contributor) {
                        var iRole;
                        for (iRole = 0; iRole < contributor.role.length; iRole++) {
                            if (contributor.role[iRole] === 'producer') {
                                return true;
                            }
                        }
                        return false;
                    };

                    scope.exportItem = function () {
                        Content.exportSingle(scope.alias, scope.root, '/', scope.alias);
                    };

                    scope.seeContributorPage = function (contributor) {
                        if (contributor.entity.id) {
                            $location.url('/contributors/' + contributor.entity.id);
                        }
                    };

                    scope.$on('$routeUpdate', function () {
                        if ($location.search().browse !== scope.browse) {
                            scope.browse = $location.search().browse;
                        }
                    });

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
                        scope.icons = icons;
                        scope.currentContent = scope.content;
                        scope.showingDescription = false;
                    }

                    function init() {
                        scope.initilizing = true;
                        initScopeVariables();
                        loadItem();
                        scope.initilizing = false;
                    }

                    // init();
                }
            }
        };
    }]);

