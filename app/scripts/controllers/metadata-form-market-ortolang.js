'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataFormMarketOrtolangCtrl', [ '$scope', '$rootScope', '$q', function ($scope, $rootScope, $q) {
    
	$scope.categories = [{id:'Corpora', label:'Corpus'}, {id:'Lexicon', label:'Lexique'}];
	$scope.useConditions = [{id:'free', label:'Libre'}, {id:'free-nc', label:'Libre sans usage commercial'}, {id:'restricted', label:'Négociation nécessaire'}];
	
	$scope.submit = function(form, md) {

		if (form.$invalid) {
			console.debug('not ready');
		    return;
		}

		// var use_conditionsLabel = '';
		// angular.forEach($scope.use_conditions, function(uc) {
		// 	if(uc.id == md.use_conditions) {
		// 		use_conditionsLabel = uc.label;
		// 	}
		// });

		// var content = createRDF(md.category, md.title, md.description, md.abstract, use_conditionsLabel);
		// var contentType = "application/rdf+xml";
		var content = toN3(md.category, md.title, md.description, md.abstract, md.useConditions);
		var contentType = 'text/n3';

		$rootScope.$broadcast('metadata-editor-create', content, contentType);
	};


	// ********* //
	// RDF Utils //
	// ********* //

	// function createRDF(category, title, description, abstract, use_conditions) {
	// 	var header = '<?xml version="1.0" encoding="UTF-8"?> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:otl="http://www.ortolang.fr/ontology/" xmlns:market="http://www.ortolang.fr/2014/09/market#"><rdf:Description rdf:about="${target}">\n';

 //    	var footer = '</rdf:Description>\n</rdf:RDF>';

	// 	var content = '' + header;

	// 	content += '<dc:identifier>${targetKey}</dc:identifier>\n';

	// 	// Requires
	// 	if(category !== undefined && category != '') {
	// 		content += '<rdf:type rdf:resource="http://www.ortolang.fr/2014/09/market#'+category+'"/>\n';	
	// 	}
	// 	if(title !== undefined && title != '') {
	// 		content += '<dc:title>'+title+'</dc:title>\n';
	// 	}

	// 	content += '<dc:description>'+description+'</dc:description>\n';
	// 	content += '<dcterms:abstract>'+abstract+'</dcterms:abstract>\n';
	// 	content += '<otl:use_conditions>'+use_conditions+'</otl:use_conditions>\n'
	
	// 	return content + footer;
	// }

	function toN3(category, title, description, abstract, useConditions) {
		var content = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n'+
			'@prefix dc: <http://purl.org/dc/elements/1.1/> .\n'+
			'@prefix dcterms: <http://purl.org/dc/terms/> .\n'+
			'@prefix otl: <http://www.ortolang.fr/ontology/> .\n'+
			'@prefix market: <http://www.ortolang.fr/2014/09/market#> .\n';

		content += '<${target}> dc:identifier "${targetKey}" ;\n';
		
		// Requires
		if(category !== undefined && category !== '') {
			content += ' rdf:type market:'+category+' ;\n';
		}
		if(title !== undefined && title !== '') {
			content += ' dc:title "'+title+'" ;\n';
		}

		content += ' dc:description "'+description+'" ;\n';
		content += ' dcterms:abstract "'+abstract+'" ;\n';
		content += ' otl:use_conditions "'+useConditions+'" .\n';
	
		return content;
	}

	function fromN3(content) {

		var deferred = $q.defer();
		var mdFromN3 = {};
		// ${target} : 
		// ${targetKey}
		var find = '\\$\\{target\\}';
		var re = new RegExp(find, 'g');
		var contentPurify = content.replace(re, 'info:otl/target');
		// var contentPurify = content;

		var N3Util = N3.Util;
		var parser = N3.Parser();
		var prefixesNeeded = {'dc': 'http://purl.org/dc/elements/1.1/',
								 'dcterms': 'http://purl.org/dc/terms/',
								 'market': 'http://www.ortolang.fr/2014/09/market#',
								 'otl': 'http://www.ortolang.fr/ontology/',
								 'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'};

		parser.parse(contentPurify,
             function (error, triple) {
				if (triple) {
					var literalValue;
	               	if(N3Util.isLiteral(triple.object)) {
						literalValue = N3Util.getLiteralValue(triple.object);
	               	}
					
					if(triple.predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
						var catId = triple.object.split('#').pop();

						mdFromN3.category = catId;
					} else if(triple.predicate === N3Util.expandQName('dc:title', prefixesNeeded)) {
	                 	// 'http://purl.org/dc/elements/1.1/title'
	                 	mdFromN3.title = angular.copy(literalValue);
					} else if(triple.predicate === N3Util.expandQName('dc:description', prefixesNeeded)) {
	                 	// 'http://purl.org/dc/elements/1.1/title'
	                 	mdFromN3.description = angular.copy(literalValue);
					} else if(triple.predicate === N3Util.expandQName('dcterms:abstract', prefixesNeeded)) {
	                 	// 'http://purl.org/dc/elements/1.1/title'
	                 	mdFromN3.abstract = angular.copy(literalValue);
					} else if(triple.predicate === N3Util.expandQName('otl:use_conditions', prefixesNeeded)) {
	                 	// 'http://purl.org/dc/elements/1.1/title'
	                 	mdFromN3.useConditions = angular.copy(literalValue);
					}

               }
               else if(error) {
               		console.error('Parse error : ', error);
					deferred.reject();
               }
               else {
					// console.debug("# That's all, folks!", prefixes);
					console.debug('Parse success !', mdFromN3);
					deferred.resolve(mdFromN3);
               }
             });

		return deferred.promise;
	}

	if($scope.selectedMetadataContent !== undefined) {
		var mdFromN3 = fromN3($scope.selectedMetadataContent);
		mdFromN3.then(function(data) {
			$scope.md = angular.copy(data);
		});
	}

  }]);
