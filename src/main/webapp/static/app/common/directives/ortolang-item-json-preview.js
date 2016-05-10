'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ortolangItemJsonPreview
 * @description
 * # ortolangItemJsonPreview
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('ortolangItemJsonPreview', ['$rootScope', '$filter', '$location', '$modal', '$translate', 'Helper', 'Settings', 'Content', 'url', function ($rootScope, $filter, $location, $modal, $translate, Helper, Settings, Content, url) {
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
                            case 'Terminologie':
                                return 'terminologies';
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

                    scope.computeTextCitation = function ($scope) {
                        if ($scope.bibliographicCitation) {
                            return $scope.bibliographicCitation;
                        }
                        var citation = '', i;
                        if ($scope.content.publications && $scope.content.publications.length > 0) {
                            angular.forEach($scope.content.publications, function (publication) {
                                citation += '<p>' + publication + '</p>';
                            });
                        }
                        if ($scope.producers && $scope.producers.length > 0) {
                            for (i = 0; i < $scope.producers.length; i++) {
                                if (i !== 0) {
                                    citation += ', ';
                                }
                                citation += $scope.producers[i].fullname;
                            }
                        } else if ($scope.authors && $scope.authors.length > 0) {
                            for (i = 0; i < $scope.authors.length; i++) {
                                if ($scope.authors[i].entity) {
                                    if (i !== 0) {
                                        citation += ', ';
                                    }
                                    citation += $scope.authors[i].entity.fullname;
                                }
                            }
                        }
                        citation += '. (' + $filter('date')($scope.content.publicationDate, 'yyyy') + ').';
                        citation += ' <i>' + $scope.title + '</i> [' + $scope.content.type + '].';
                        citation += ' ORTOLANG (Open Resources and TOols for LANGuage) - <a target="_BLANK" href="https://www.ortolang.fr">www.ortolang.fr</a>,';
                        citation += ' <a target="_BLANK" href="' + $scope.handle + '">' + $scope.handle + '</a>.';
                        return citation;
                    };

                    scope.computeBibtexCitation = function ($scope) {
                        if ($scope.bibliographicCitation) {
                            return undefined;
                        }
                        var i,
                            bibTeX = '@misc{' + url.handlePrefix + '/' + $scope.alias + ($scope.tag ? '/' + $scope.tag.name : '') + ',\n';
                        bibTeX += '    title = {' + $scope.title + '},\n';
                        bibTeX += '    author = {';
                        if ($scope.producers && $scope.producers.length > 0) {
                            for (i = 0; i < $scope.producers.length; i++) {
                                if (i !== 0) {
                                    bibTeX += ', ';
                                }
                                bibTeX += $scope.producers[i].fullname;
                            }
                        } else if ($scope.authors && $scope.authors.length > 0) {
                            for (i = 0; i < $scope.authors.length; i++) {
                                if ($scope.authors[i].entity) {
                                    if (i !== 0) {
                                        bibTeX += ', ';
                                    }
                                    bibTeX += $scope.authors[i].entity.fullname;
                                }
                            }
                        }
                        bibTeX += '},\n';
                        bibTeX += '    url = {' + $scope.handle + '},\n';
                        bibTeX += '    note = {{ORTOLANG (Open Resources and TOols for LANGuage)} - www.ortolang.fr},\n';
                        bibTeX += '    copyright = {' + $scope.license.label + '},\n}';
                        bibTeX += '    year = {' + $filter('date')($scope.content.publicationDate, 'yyyy') + '}\n}';
                        return bibTeX;
                    };

                    function initScopeVariables() {
                        // Show info, browse, ...
                        scope.marketItemTemplate = undefined;
                        scope.image = undefined;
                        scope.imgtitle = undefined;
                        scope.currentContent = scope.content;
                        scope.showingDescription = false;
                        scope.handle = 'https://hdl.handle.net/' + url.handlePrefix + '/' + scope.alias + (scope.tag ? '/' + scope.tag.name : '');
                        scope.shortHandle = 'hdl:' + url.handlePrefix + '/' + scope.alias + (scope.tag ? '/' + scope.tag.name : '');
                    }

                    scope.howToCite = function ($scope, $event) {
                        $event.preventDefault();
                        var modalScope = Helper.createModalScope();
                        modalScope.models = {
                            citation: scope.computeTextCitation($scope),
                            bibTeX: scope.computeBibtexCitation($scope)
                        };
                        modalScope.select = function (target) {
                            if (target === 'bibtext') {
                                document.getElementById('citation-bibtex').select();
                            } else {
                                var text = document.getElementById('citation-text'),
                                    range,
                                    selection;
                                if (document.body.createTextRange) {
                                    range = document.body.createTextRange();
                                    range.moveToElementText(text);
                                    range.select();
                                } else if (window.getSelection) {
                                    selection = window.getSelection();
                                    range = document.createRange();
                                    range.selectNodeContents(text);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }
                            }
                        };
                        modalScope.$on('modal.show', function () {
                            var target = angular.element($event.target);
                            if (target.hasClass('label')) {
                                if (target.hasClass('bibtex')) {
                                    modalScope.select('bibtext');
                                } else {
                                    modalScope.select();
                                }
                            }
                        });
                        $modal({
                            scope: modalScope,
                            templateUrl: 'common/directives/citation-modal-template.html',
                            show: true
                        });
                    };

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

