'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PublicationsCtrl
 * @description
 * # PublicationsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PublicationsCtrl', ['$scope', '$http',
        function ($scope, $http) {

            $scope.publications = [];

            $scope.loadPublications = function () {
                //$http.get('http://api.archives-ouvertes.fr/search/?q=vin&wt=xml')
                ////$http.get('http://api.archives-ouvertes.fr/ref/authorstructure/?firstName_t=jean&lastName_t=dupont&wt=xml')
                ////$http.get('http://api.archives-ouvertes.fr/ref/structure/?q=authFullName_t:Claire+Gardent&wt=json')
                //    .success(function (data) {
                //        console.debug('publications : ', data);
                //        $scope.publications = data;
                //    })
                $scope.solrUrl = 'http://api.archives-ouvertes.fr/ref/structure';
                $scope.query = 'text';

                $http({
                    method: 'JSONP',
                    url: $scope.solrUrl,
                    params: {
                        'json.wrf': 'JSON_CALLBACK',
                        'q': $scope.query
                        }
                    })
                    .success(function (data) {
                        console.debug('publications : ', data);
                        $scope.publications = data;

                    }).error(function (reason) {
                            console.error('Fail to retrieve publications. ', reason);
                        }
                    );

            };

            console.debug('publi !');
            $scope.loadPublications();
        }
]);
