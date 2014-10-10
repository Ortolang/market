'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataCreatorCtrl
 * @description
 * # MetadataCreatorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataCreatorMarketOrtolangCtrl',['$scope', '$http', 'Url', function ($scope, $http, Url) {
    console.debug('MetadataCreatorMarketOrtolangCtrl')
    
    //$scope.userCategory = null;
	$scope.categories = [{id:'Corpora', label:'Corpus'}, {id:'Lexicon', label:'Lexique'}];
	$scope.use_conditions = [{id:'free', label:'Libre'}, {id:'free-nc', label:'Libre sans usage commercial'}, {id:'restricted', label:'Négociation nécessaire'}];

	$scope.submit = function(form, md) {
		console.debug("submit form : ");
		console.debug(form);

		if (form.$invalid) {
			console.debug('not ready');
		    return;
		}

		var uploadUrl = Url.urlBase() + '/rest/workspaces/'+$scope.wsName+'/elements/';
		var fd = new FormData();

		var currentPath = $scope.element.path;
		if($scope.selectedChild) {
			currentPath += '/' + $scope.selectedChildData.object.name
		}
		fd.append('path', currentPath);
		fd.append('type', 'metadata');
		
		var mdName = "unknow";
        fd.append('format', $scope.userMetadataFormat);

        //TODO use lodash
        angular.forEach($scope.metadataFormats, function(mdFormat) {
        	if(mdFormat.id==$scope.userMetadataFormat) {
        		mdName = mdFormat.name;
        	}
        });

        fd.append('name', mdName);

        // JavaScript file-like object...
		//var content = '<a id="a"><b id="b">hy!</b></a>'; // the body of the new file...
		//TODO use lodash
		
		var use_conditionsLabel = '';
		angular.forEach($scope.use_conditions, function(uc) {
			if(uc.id == md.use_conditions) {
				use_conditionsLabel = uc.label;
			}
		});

		var content = createRDF(md.category, md.title, md.description, md.abstract, use_conditionsLabel);
		var blob = new Blob([content], { type: "text/xml"});

		fd.append("stream", blob);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        	console.debug("metadata created !");
        })
        .error(function(){
        	console.error("creation of metadata failed !");
        });
	};

	function createRDF(category, title, description, abstract, use_conditions) {
		var header = '<?xml version="1.0" encoding="UTF-8"?> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:otl="http://www.ortolang.fr/ontology/" xmlns:market="http://www.ortolang.fr/2014/09/market#"><rdf:Description rdf:about="${target}">\n';

    	var footer = '</rdf:Description>\n</rdf:RDF>';

		var content = '' + header;

		content += '<dc:identifier>${targetKey}</dc:identifier>\n';

		// Requires
		if(category !== undefined && category != '') {
			content += '<rdf:type rdf:resource="http://www.ortolang.fr/2014/09/market#'+category+'"/>\n';	
		}
		if(title !== undefined && title != '') {
			content += '<dc:title>'+title+'</dc:title>\n';
		}

		content += '<dc:description>'+description+'</dc:description>\n';
		content += '<dcterms:abstract>'+abstract+'</dc:abstract>\n';
		content += '<otl:use_conditions>'+use_conditions+'</otl:use_conditions>\n'
	
		return content + footer;
	}
  }]);
