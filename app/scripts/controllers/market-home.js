'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MarketHomeCtrl',['$scope', '$http', 'Url', 'ObjectResource', 'N3Serializer', function ($scope, $http, Url, ObjectResource, N3Serializer) {
    
  	function loadObjects() {
  		// Loads all objects
  		ObjectResource.get({}, function (oobjects) {

  			angular.forEach(oobjects.entries, function(entry) {
  				
  				// Loads properties of each object
	  			ObjectResource.get({oKey: entry}, function (oobject) {
	  				if(oobject.object.root === true) {
	  					if (oobject.object.metadatas.length > 0) {
                            //TODO find metadata in Resource name or rdf format ??
                            var metaKey = oobject.object.metadatas[0].key;

                            $http.get(Url.urlBase() + '/rest/objects/' + metaKey + '/download').success(function (metaContent) {
                                N3Serializer.fromN3(metaContent).then(function (data) {
                                    
                                    $scope.items.push({oobject: oobject, meta: data});
                                });
                            }).error(function (error) {
                            	//TODO a tester
                            	console.error('error during process : '+error);
                            });
                        }
	  				}
	  			});
  			});
  		});
  	}

    // Scope variables
    function initScopeVariables() {
        $scope.items = [];
    }

    function init() {
        initScopeVariables();
        loadObjects();
    }
    init();

  }]);
