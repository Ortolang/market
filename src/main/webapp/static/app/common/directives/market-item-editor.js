'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemEditor
 * @description
 * # marketItemEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemEditor', ['$translate', '$http', 'ortolangType', 'url', 'WorkspaceBrowserService', function ($translate, $http, ortolangType, url, WorkspaceBrowserService) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/market-item-editor.html',
            scope: {
                metadata: '=',
                back: '&'
            },
            link: {
                pre: function (scope) {

                    scope.submitForm = function() {
                        console.log('submit form');

                        for(var propertyName in scope.metadata) {
                            if(scope.metadata[propertyName].length===0) {
                                delete scope.metadata[propertyName];
                            }
                        }

                        if (scope.metadataItemform.$invalid) {
                            console.log('not ready');
                            return;
                        }

                        var content = angular.toJson(scope.metadata),
                            contentType = 'text/json';

                        sendForm(content, contentType);
                    };


                    function sendForm(content, contentType) {

                        var uploadUrl = url.api + '/workspaces/' + (scope.selectedElements ? scope.selectedElements[0].workspace : WorkspaceBrowserService.workspace.key) + '/elements/',
                            fd = new FormData(),
                            currentPath = scope.selectedElements ? scope.selectedElements[0].path : '/';

                        fd.append('path', currentPath);
                        fd.append('type', ortolangType.metadata);

                        // fd.append('format', scope.userMetadataFormat.key);
                        fd.append('name', 'ortolang-item-json');

                        var blob = new Blob([content], { type: contentType});

                        fd.append('stream', blob);

                        $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function () {

                            console.log('submit form success');
                            // scope.hideEditor();
                            // resetMetadataFormat();
                            // scope.refreshSelectedElement();
                            scope.back();

                        })
                        .error(function (error) {
                            console.error('creation of metadata failed !', error);
                            // scope.hideEditor();
                            // resetMetadataFormat();
                        });
                    }


                    function isProducer (contributor) {
                        var iRole;
                        for (iRole = 0; iRole < contributor.role.length; iRole++) {
                            if (contributor.role[iRole] === 'producer') {
                                return true;
                            }
                        }
                        return false;
                    }

                    function init() {
                        scope.itemTypes = [ 
                            { 
                                key:'Corpus', 
                                value: $translate.instant('MARKET.ITEM_TYPE.CORPORA') 
                            },
                            { 
                                key:'Lexique', 
                                value: $translate.instant('MARKET.ITEM_TYPE.LEXICON') 
                            },
                            { 
                                key:'Outil', 
                                value: $translate.instant('MARKET.ITEM_TYPE.TOOL') 
                            },
                            { 
                                key:'Application', 
                                value: $translate.instant('MARKET.ITEM_TYPE.INTEGRATED_PROJECT') 
                            }
                        ];

                        scope.producers = [];
                        angular.forEach(scope.metadata.contributors, function(contributor) {
                            if (isProducer(contributor)) {
                                scope.producers.push(contributor.entity);
                            }
                        });
                    }
                    init();
                }
            }
        };
    }]);