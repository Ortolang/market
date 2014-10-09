'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PluginctrlCtrl
 * @description
 * # PluginctrlCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
      .controller('PluginCtrl', [ '$scope', '$http', 'PluginsResource', '$routeParams', function ($scope, $http, PluginsResource, $routeParams) {
        /**
         * Load chosen plugin
         */
        $scope.loadPlugin = function () {
            $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
            PluginsResource.getPlugin({pKey: $routeParams.plName},
                function (plugin) {
                    $scope.plugin = plugin;
                },
                function (error) {
                    console.log(error);
                });
        };

        $scope.plName = $routeParams.plName;
        $scope.plugin = null;
        $scope.loadPlugin();

        //test dynamic form

//
//        $scope.test = ['bli', 'toto'];
//        $scope.fields =
//            [
//                {
//                    'type' : 'div',
//                    'html' : [
//                        {
//                            'name': 'input',
//                            'id': 'txt-input',
//                            'caption': 'Fichier à annoter',
//                            'type': 'text',
//                            'placeholder': 'Nom du fichier à annoter',
//                            'typehead': {
//                                'source' : [ 'Apple', 'Android', 'Windows Phone', 'Blackberry' ]
//                            },
//                            'validate': {
//                                'required': true
//                            }
//                        },
//                        {
//                            'type' : 'p',
//                            'html' : 'Entrez le nom du fichier texte sur lequel vous souhaitez appliquer Tree Tagger.'
//                        }
//                    ]
//                },
//                {
//                    'type' : 'div',
//                    'html' : [
//                        {
//                            'name': 'lg',
//                            'caption': 'Langue du texte',
//                            'type': 'select',
//                            'options': {
//                                'fr': {
//                                    'selected': 'selected',
//                                    'html': 'Français'
//                                },
//                                'en': 'Anglais',
//                                'de': 'Allemand'
//                            },
//                            'validate' : {
//                                'required': true
//                            }
//                        },
//                        {
//                            'type' : 'p',
//                            'html' : 'Selectionnez la langue du fichier à annoter.'
//                        }
//                    ]
//                },
//                {
//                    'type': 'submit',
//                    'value': 'Run TreeTagger'
//                }
//            ];

    }]);