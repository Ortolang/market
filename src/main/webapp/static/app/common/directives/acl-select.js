'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:aclSelect
 * @description
 * # aclSelect
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('aclSelect', ['$http', '$filter', 'Url', 'DownloadResource', 'WorkspaceElementResource', function ($http, $filter, Url, DownloadResource, WorkspaceElementResource) {
        return {
            restrict: 'E',
            scope: {
                element: '='
            },
            templateUrl: 'common/directives/acl-select.html',

            link: {
                pre: function (scope) {

                    function loadACL(element) {

                        scope.model = "";
                        if(element.metadatas.length>0) {
                            var acl = $filter('filter')(element.metadatas, {'name': 'ortolang-acl-json'});

                            if(acl.length===1) {

                                DownloadResource.download({oKey: acl[0].key}).success(function (aclContentJson) {
                                    var aclContent = angular.fromJson(aclContentJson);

                                    if(aclContent!=="") {
                                        scope.model= aclContent.template;
                                    }

                                }).error(function (reason) {
                                    console.log('Cannot load ACL for '+element);
                                    console.log(reason);
                                });
                            }
                        }
                    }

                    scope.sendACL = function (model) {
                        console.log('Send ACL');
                        var uploadUrl = Url.urlBase() + '/rest/workspaces/' + scope.element.workspace + '/elements/',
                            fd = new FormData(),
                            currentPath = scope.element.path,
                            content = angular.toJson({template:model}),
                            contentType = 'text/json';

                        fd.append('path', currentPath);
                        fd.append('type', 'metadata');

                        fd.append('format', 'ortolang-acl-json');
                        fd.append('name', 'ortolang-acl-json');

                        var blob = new Blob([content], { type: contentType});

                        fd.append('stream', blob);

                        $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function () {
                            console.log('Sets ACL for '+scope.element.key);
                        })
                        .error(function (reason) {
                            console.log('Cannot sets ACL for '+scope.element.key+' cause ', reason);
                        });
                    }

                    scope.aclRules = [{key:'forall', name:'Pour tous'},{key:'authentified', name:'Personnes authentifiés'},{key:'esr', name:'Membres ESR'},{key:'restricted', name:'Réservé aux membres'}]

                    scope.$watch('element', function (val) {
                        if(scope.element!==undefined) {
                            loadACL(scope.element);
                        }
                    });

                }
            }
        };
    }]);
