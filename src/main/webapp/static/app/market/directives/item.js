'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', [ 'ObjectResource', 'DownloadResource',  function (ObjectResource, DownloadResource) {
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
                    var key = (scope.entry.root !== undefined) ? scope.entry.root : scope.entry.key;

                    if (scope.entry.applicationUrl) {
                        scope.itemUrl = scope.entry.applicationUrl;
                    } else {
                        scope.itemUrl = '#/market/item/' + scope.entry.key;
                    }

                    if(scope.entry.image) {
                                                
                        ObjectResource.element({oKey: key, path: scope.entry.image}).$promise.then(function(oobject) {
                            scope.image = DownloadResource.getDownloadUrl({oKey: oobject.key});
                        }, function (reason) {
                            console.error(reason);
                        });
                    } else {
                        scope.imgtitle = '';
                        scope.imgtheme = 'custom';
                        if(scope.entry.title) {
                            scope.imgtitle = scope.entry.title.substring(0,2);
                            scope.imgtheme = scope.entry.title.substring(0,1).toLowerCase();
                        }
                    }
                }
            }
        };
    }]);
