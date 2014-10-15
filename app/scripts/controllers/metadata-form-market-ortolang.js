'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataFormMarketOrtolangCtrl', [ '$scope', '$rootScope', function ($scope, $rootScope) {
    
	$scope.categories = [{id:'Corpora', label:'Corpus'}, {id:'Lexicon', label:'Lexique'}];
	$scope.use_conditions = [{id:'free', label:'Libre'}, {id:'free-nc', label:'Libre sans usage commercial'}, {id:'restricted', label:'Négociation nécessaire'}];

	$scope.submit = function(form, md) {

		if (form.$invalid) {
			console.debug('not ready');
		    return;
		}

		var use_conditionsLabel = '';
		angular.forEach($scope.use_conditions, function(uc) {
			if(uc.id == md.use_conditions) {
				use_conditionsLabel = uc.label;
			}
		});

		var content = createRDF(md.category, md.title, md.description, md.abstract, use_conditionsLabel);
		var contentType = "application/rdf+xml";

		$rootScope.$broadcast('metadata-editor-create', content, contentType);
	};


	// ********* //
	// RDF Utils //
	// ********* //

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
		content += '<dcterms:abstract>'+abstract+'</dcterms:abstract>\n';
		content += '<otl:use_conditions>'+use_conditions+'</otl:use_conditions>\n'
	
		return content + footer;
	}
  }]);
