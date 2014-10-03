'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('ProductsCtrl', ['$scope', '$http', '$routeParams', '$sce', '$filter', 'Url', function ($scope, $http, $routeParams, $sce, $filter, Url) {
    console.debug('controller marketCtrl');

		$scope.query = '';

		var defaultCategoriesLabel = "Catégories"
		$scope.categoriesLabel = defaultCategoriesLabel;
		$scope.categories = [];
		$scope.selectedCategory = undefined;

		function findAllCarrot(search) {

			var urlService = Url.urlBase() + '/rest/objects/semantic';

			var query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '
			.concat('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ')
			.concat('PREFIX dc: <http://purl.org/dc/elements/1.1/> ')
			.concat('PREFIX dcterms: <http://purl.org/dc/terms/> ')
			.concat('PREFIX otl: <http://www.ortolang.fr/ontology/>')
			.concat('PREFIX market: <http://www.ortolang.fr/2014/09/market#> ')
			.concat('SELECT DISTINCT ?x ?resource_type ?title ?abstract ?use_conditions WHERE { ')
			.concat(' ?x rdf:type ?resource_type ')
			.concat(' . ?market_type rdfs:subClassOf market:Product ')
			.concat(' . ?x dc:title ?title ')
			.concat(' ; dcterms:abstract ?abstract ')
			.concat(' ; otl:use_conditions ?use_conditions ');
			var queryStrEscape;
			if(search!==undefined) {
				// TODO escape "'
				// TODO split by space
				queryStrEscape = search;
				query.concat(' ; ?all_pred ?all_value')
					.concat(' . FILTER regex(?all_value, "').concat(queryStrEscape).concat('", "i")');
			}

			query += '}';
			
			var url = urlService + '?query=' + encodeURIComponent(query);
			console.log('Call service at url : '+urlService);
			console.log('Query : '+query);
			$http.get(url).success(function (data) {

			// console.debug("data : "+JSON.stringify(data));
			$scope.products = [];

			//TODO si bindings vide alors affichier juste un message d'erreur "L'identifiant $identifiant n'est pas une resource connue dans la plateforme"
			angular.forEach(data.results.bindings, function (binding) {
				var uri = binding.x.value;
                var title = binding.title.value;
                var abstract = binding.abstract.value;
                var use_conditions = binding.use_conditions.value;
                var resource_type = binding.resource_type.value;

                // Extract key
                var key = uri.split('/').pop();
                var type = resource_type.split('#').pop().toLowerCase();

                $scope.categories.push({id: type, name: type, count: 1});

                // Finds products already added
                var oldProduct = $filter('filter')($scope.products, {key: key});

                if(oldProduct.length == 0) {
                	// If new product, then add it
					$scope.products.push({key: key, uri: uri, title: title, type: [type], abstract: abstract, abstract_html: $sce.trustAsHtml(abstract), use_conditions:use_conditions});
				} else {
					// Else changed it (it could have many type)
					// var oldType=oldProduct[0].type[0];
					// oldProduct[0].type = [oldType, type];
					oldProduct[0].type.push(type);
                }
				
            });

		});

		}

        $scope.filterProducts = function (filterText) {
            return function (product) {
                var re = new RegExp(filterText, 'gi');
                return product.title.match(re) || product.abstract.match(re) || product.use_conditions.match(re);
            };
        };

        $scope.filterProductsByCategory = function(selectedCategory) {
        	return function (product) {
        		if(selectedCategory === undefined) {
        			return true;
        		}
        		var found = false;
                angular.forEach(product.type, function(categoryId) {
                	if(categoryId == selectedCategory) {
                		found = true;
                	}
                });
                return found;
            };
        }

        $scope.setSelectedCategory = function(category) {
        	$scope.selectedCategory = category;
        	$scope.categoriesLabel = category;
        }

        findAllCarrot();

  }]);
