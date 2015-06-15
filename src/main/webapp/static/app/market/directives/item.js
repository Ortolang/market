'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', [ '$location', 'ObjectResource', 'DownloadResource',  function ($location, ObjectResource, DownloadResource) {
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
                        var type;
                        if(scope.entry.type === 'Corpus') {
                            type = 'corpora';
                        } else if(scope.entry.type === 'Lexique') {
                            type = 'lexicons';
                        } else if(scope.entry.type === 'Outil') {
                            type = 'tools';
                        }
                        scope.itemUrl = '#/market/' + type + '/' + scope.entry.key;
                        // scope.itemUrl = '#' + $location.path() + '/' + scope.entry.key;
                    }

                    if(scope.entry.image) {
                        ObjectResource.element({key: key, path: scope.entry.image}).$promise.then(function (oobject) {
                            scope.image = DownloadResource.getDownloadUrl({key: oobject.key});
                        }, function (reason) {
                            console.error(reason);
                        });
                    } else {
                        scope.imgtitle = '';
                        scope.imgtheme = 'custom';
                        if(scope.entry.title) {
                            scope.imgtitle = scope.entry.title.substring(0, 2);
                            scope.imgtheme = scope.entry.title.substring(0, 1).toLowerCase();
                        }
                    }
                }
            }
        };
    }]);
