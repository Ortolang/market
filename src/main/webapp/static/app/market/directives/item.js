'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', ['ObjectResource', 'Content', 'Settings',  function (ObjectResource, Content, Settings) {
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

                    function getTitle(titleMultiling, lang) {
                        var iTitle;
                        for (iTitle = 0; iTitle < titleMultiling.length; iTitle++) {
                            if (titleMultiling[iTitle].lang === lang) {
                                return titleMultiling[iTitle].value;
                            }
                        }
                        return titleMultiling.length>0 ? titleMultiling[0].value : 'untitle';
                    }
                    var key = (scope.entry.root !== undefined) ? scope.entry.root : scope.entry.key;

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
                        scope.itemUrl = '#/market/' + type + '/' + scope.entry.key;
                    }

                    if(scope.entry.title) {
                        scope.title = getTitle(scope.entry.title, Settings.language);
                    }

                    if (scope.entry.image) {
                        ObjectResource.element({key: key, path: scope.entry.image}).$promise.then(function (oobject) {
                            scope.image = Content.getContentUrlWithKey(oobject);
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
                }
            }
        };
    }]);
