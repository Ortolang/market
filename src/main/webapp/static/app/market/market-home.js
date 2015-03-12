'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketHomeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'ObjectResource', 'DownloadResource', 'N3Serializer', function ($scope, $rootScope, $routeParams, $location, $window, ObjectResource, DownloadResource, N3Serializer) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $rootScope.selectSearch();
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (entry) {
            if (entry.meta && entry.meta['http://www.ortolang.fr/ontology/applicationUrl']) {
                $window.open(entry.meta['http://www.ortolang.fr/ontology/applicationUrl']);
            } else {
                $location.path('/market/item/' + entry.key);
            }
        };

        function loadMetadata() {

            angular.forEach($scope.items, function (item) {
                // Loads properties of each object
                ObjectResource.get({oKey: item.key}).$promise
                    .then(function (oobject) {

                        if (oobject.object.root === true && oobject.object.metadatas.length > 0) {

                            var metaKey = oobject.object.metadatas[0].key;

                            DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                N3Serializer.fromN3(metaContent).then(function (data) {

                                    if (data['http://purl.org/dc/elements/1.1/title'] && data['http://purl.org/dc/elements/1.1/title'] === 'Littéracie Avancée' || data['http://purl.org/dc/elements/1.1/title'] === 'Corpus 14' || data['http://purl.org/dc/elements/1.1/title'] === 'CoMeRe (Communication médiée par les réseaux)') {
                                        $scope.news.push(item);
                                    }
                                    if (data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type'] === 'Site web') {
                                        $scope.website.push(item);
                                    }
                                    if (data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type'] === 'Corpus') {
                                        $scope.corpora.push(item);
                                    }
                                    if (data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type'] === 'Lexique') {
                                        $scope.lexiques.push(item);
                                    }
                                    if (data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type'] === 'Outil') {
                                        $scope.outils.push(item);
                                    }
                                });
                            }).error(function (error) {
                                console.error('error during process : ' + error);
                            });
                        }
                    }, function (reason) {
                        console.error(reason);
                    });
            });
        }

        function loadObjects() {
            // Loads all objects
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(function (oobjects) {
                var index = 0;
                angular.forEach(oobjects.entries, function (entry) {
                    $scope.items.push({key: entry, rang: index});
                    index++;
                });
                loadMetadata();
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.corpora = [];
            $scope.lexiques = [];
            $scope.outils = [];
            $scope.website = [];
            $scope.news = [];

            $scope.content = '';
        }

        function init() {
            initScopeVariables();

            $scope.section = $routeParams.section;
            loadObjects();
        }
        init();

    }]);
