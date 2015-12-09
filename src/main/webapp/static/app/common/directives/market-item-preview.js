'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemPreview
 * @description
 * # marketItemPreview
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemPreview', ['$rootScope', '$filter', '$location', 'ObjectResource', 'Settings', 'Content', '$translate', function ($rootScope, $filter, $location, ObjectResource, Settings, Content, $translate) {
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
                icons: '='
            },
            template: '<div ng-include="marketItemTemplate"></div>',
            link: {
                pre: function (scope) {

                    function loadItem() {

                        $rootScope.ortolangPageTitle = getValue(scope.content.title, 'lang', Settings.language, 'Untitled');

                        if (scope.content.schema) {

                            scope.browse = $location.search().browse;
                            scope.preview = $location.search().preview;

                            if (scope.content.schema === 'http://www.ortolang.fr/schema/012#') {
                                scope.marketItemTemplate = 'market/templates/market-item-12.html';

                                refreshMultilingualValue(scope.content, Settings.language);
                                if (scope.content.publications) {
                                    scope.primaryPublications = getValues(scope.content.publications, 'priority', 'primary');
                                    scope.secondaryPublications = getValues(scope.content.publications, 'priority', 'secondary');
                                }
                                scope.itemMarketType = getItemType(scope.content);

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
                            } if (scope.content.schema === 'http://www.ortolang.fr/schema/013#') {
                                scope.marketItemTemplate = 'market/templates/market-item-13.html';

                                refreshMultilingualValue(scope.content, Settings.language);
                                if (scope.content.publications) {
                                    scope.primaryPublications = getValues(scope.content.publications, 'priority', 'primary');
                                    scope.secondaryPublications = getValues(scope.content.publications, 'priority', 'secondary');
                                }
                                scope.itemMarketType = getItemType(scope.content);

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

                                // if (scope.content.license !== undefined && scope.content.license !== '') {
                                //     loadLicense(scope.itemKey, scope.content.license);
                                // }

                                if (scope.content.datasize !== undefined && scope.content.datasize !== '') {
                                    scope.datasizeToPrint = {'value': $filter('bytes')(scope.content.datasize)};
                                }

                            }  else {
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
                            scope.keywordsString = '';
                            angular.forEach(scope.keywords, function (keyword, index) {
                                scope.keywordsString += (index === 0 ? '' : ', ') + keyword;
                            });
                        }
                        if (item.bibliographicCitation) {
                            scope.bibliographicCitation = getValue(item.bibliographicCitation, 'lang', lang);
                        }
                        if (item.relations) {
                            scope.relations = [];
                            angular.forEach(item.relations, function(relation) {
                                var url = null;
                                if(relation.type==='hasPart') {
                                    url = relation.path;
                                } else {
                                    url = Content.getContentUrlWithPath(relation.path, scope.alias, scope.root);
                                    if (startsWith(relation.url, 'http')) {
                                        url = relation.url;
                                    }
                                }

                                scope.relations.push(
                                    {
                                        label: getValue(relation.label, 'lang', lang, 'unknown'),
                                        type: relation.type,
                                        url: url,
                                        extension: relation.path.split('.').pop()
                                    }
                                );
                            });
                        }
                        if (item.commercialLinks) {
                            scope.commercialLinks = [];
                            angular.forEach(item.commercialLinks, function(commercialLink) {
                                scope.commercialLinks.push(
                                    {
                                        description: getValue(commercialLink.description, 'lang', lang, 'unknown'),
                                        acronym: commercialLink.acronym,
                                        url: commercialLink.url,
                                        img: commercialLink.img
                                    }
                                );
                            });
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

                    function startsWith (actual, expected) {
                        var lowerStr = (actual + '').toLowerCase();
                        return lowerStr.indexOf(expected.toLowerCase()) === 0;
                    }

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

