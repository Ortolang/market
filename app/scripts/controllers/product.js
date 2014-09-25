'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('ProductCtrl', ['$scope', '$http', '$routeParams','$sce', function ($scope, $http, $routeParams, $sce) {
    console.log("controller productCtrl");

        function createURIFromKey(key) {
			return angular.module('ortolangMarketApp').urlBase+"/rest/objects/"+key;
		}

		function getNamespaces() {
			return [{prefix:'dc:', namespace:"http://purl.org/dc/elements/1.1/"},
				{prefix:'dcterms:',namespace:"http://purl.org/dc/terms/"},
				{prefix:'otl:',namespace:"http://www.ortolang.fr/ontology/"},
				{prefix:'otl_dif:',namespace:"http://www.ortolang.fr/2014/05/diffusion#"}
			];
		}

		function replaceNamespaceByPrefix(value) {
			var replaceString = value;

			angular.forEach(getNamespaces(), function(namespacePrefix) {
				replaceString = replaceString.replace(namespacePrefix.namespace, namespacePrefix.prefix);
			});
		
			return replaceString;
		}

		function pushMetadata(mdName, mdValue) {
			if($scope.metadatas[mdName]!==undefined) {
				var mdOldValue = $scope.metadatas[mdName];
				$scope.metadatas[mdName] = [];
				$scope.metadatas[mdName].push(mdOldValue);
				$scope.metadatas[mdName].push(mdValue);
			}
			else {
				$scope.metadatas[mdName] = mdValue;
			}
		}

		function get(uri) {

			var urlService = angular.module('ortolangMarketApp').urlBase + '/rest/objects/semantic';

			var query = "SELECT ?pred ?obj WHERE { <".concat(uri).concat("> ?pred ?obj}");
			//console.debug("Query : "+query);

			var url = urlService + "?query=" + encodeURIComponent(query);

			$http.get(url).success(function (data) {

				console.debug("data : "+JSON.stringify(data));
				$scope.metadatas = [];
				var bindings = data.results.bindings;

				$scope.metadatas.image = "fa-file-text-o";

				angular.forEach(data.results.bindings, function (binding) {
                    var pred = binding.pred.value;
                    var obj = binding.obj.value;

                    if(pred=="http://purl.org/dc/elements/1.1/description") {
						// $scope.metadatas.description = $sce.trustAsHtml(obj);
						pushMetadata('dc:description', $sce.trustAsHtml(obj));
					} else {
						pushMetadata(replaceNamespaceByPrefix(pred), obj);
					}

				});
				
			});
		}

        var key = $routeParams.productId;

		var uri = createURIFromKey(key);
		get(uri);
  }]);
