'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('ProductsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    console.debug("controller marketCtrl");

        $scope.query = "";

		function findAllCarrot(search) {

			var urlService = angular.module('ortolangMarketApp').urlBase + '/rest/objects/semantic';
			console.debug("Search : "+search);

			var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
			.concat("PREFIX dc: <http://purl.org/dc/elements/1.1/> ")
			.concat("PREFIX dcterms: <http://purl.org/dc/terms/> ")
			.concat("PREFIX otl: <http://www.ortolang.fr/ontology/>")
			.concat("PREFIX market: <http://www.ortolang.fr/2014/09/market#> ")
			.concat("SELECT ?x ?title ?abstract ?use_conditions WHERE { ")
			.concat(" ?x rdf:type market:Carrot ")
			.concat(" ; dc:title ?title ")
			.concat(" ; dcterms:abstract ?abstract ")
			.concat(" ; otl:use_conditions ?use_conditions ")
			;

			if(search!==undefined) {
				// TODO escape "'
				// TODO split by space
				query_str_escape = search;
				query.concat(" ; ?all_pred ?all_value")
					.concat(" . FILTER regex(?all_value, \"").concat(query_str_escape).concat("\", 'i')");
			}

			query += "}";
			console.log("Query : "+query);
			var url = urlService + "?query=" + encodeURIComponent(query);

			$http.get(url).success(function (data) {

			console.debug("data : "+JSON.stringify(data));
			$scope.products = [];
			var bindings = data.results.bindings;
			//TODO si bindings vide alors affichier juste un message d'erreur "L'identifiant $identifiant n'est pas une resource connue dans la plateforme"
			angular.forEach(data.results.bindings, function (binding) {
				var uri = binding.x.value;
                var title = binding.title.value;
                var abstract = binding.abstract.value;
                var use_conditions = binding.use_conditions.value;

                // Extract key
                var key = uri.split('/').pop();

				$scope.products.push({key: key, uri: uri, title: title, image: 'src/unknow.jpg', type: 'Carotte', abstract: abstract, use_conditions:use_conditions});
            });

		});

		}

        $scope.filterProducts = function (query) {
            return function (product) {
                var re = new RegExp(query, 'gi');
                return product.title.match(re) || product.abstract.match(re) || product.use_conditions.match(re);
            };
        };

        findAllCarrot();
  }]);
