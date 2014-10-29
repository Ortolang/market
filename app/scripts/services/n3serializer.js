'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.N3JS
 * @description
 * # N3JS
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
  .factory('N3Serializer', ['$q', function ($q) {
    
    var prefixesRDF = {'dc': 'http://purl.org/dc/elements/1.1/',
             'dcterms': 'http://purl.org/dc/terms/',
             'market': 'http://www.ortolang.fr/2014/09/market#',
             'otl': 'http://www.ortolang.fr/ontology/',
             'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'};
    

    // Public API here
    return {
        /**
         * Converts a N3 content to a JS object.
         * @param a N3 content
         * @return a JS object
         **/
        fromN3: function (content) {
        
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
                        } else if(triple.predicate === N3Util.expandQName('dc:title', prefixesRDF)) {
                            mdFromN3.title = angular.copy(literalValue);
                        } else if(triple.predicate === N3Util.expandQName('dc:description', prefixesRDF)) {
                            mdFromN3.description = angular.copy(literalValue);
                        } else if(triple.predicate === N3Util.expandQName('dcterms:abstract', prefixesRDF)) {
                            mdFromN3.abstract = angular.copy(literalValue);
                        } else if(triple.predicate === N3Util.expandQName('otl:use_conditions', prefixesRDF)) {
                            mdFromN3.useConditions = angular.copy(literalValue);
                        }
                   }
                   else if(error) {
                        console.error('Parse error : ', error);
                        deferred.reject();
                   }
                   else {
                      // console.debug('Parse success !', mdFromN3);
                      deferred.resolve(mdFromN3);
                   }
                }
            );

            return deferred.promise;
        }, 

        /**
         * Converts a metadata object to N3 content.
         * @param md an object representation of N3 content
         * @return a string representation of N3 content
         **/
        toN3 : function(md) {
            var content = '',
            N3Util = N3.Util,
            writer = N3.Writer(prefixesRDF);

            writer.addTriple('${target}', N3Util.expandQName('dc:identifier', prefixesRDF), '"${targetKey}"');
            
            writer.addTriple('${target}', N3Util.expandQName('rdf:type', prefixesRDF), N3Util.expandQName('market:'+md.category, prefixesRDF));
            writer.addTriple('${target}', N3Util.expandQName('dc:title', prefixesRDF), '"'+md.title+'"');
            writer.addTriple('${target}', N3Util.expandQName('dc:description', prefixesRDF), '"'+md.description+'"');
            writer.addTriple('${target}', N3Util.expandQName('dcterms:abstract', prefixesRDF), '"'+md.abstract+'"');
            writer.addTriple('${target}', N3Util.expandQName('otl:use_conditions', prefixesRDF), '"'+md.useConditions+'"');
            

            writer.end(function (error, result) {
                if(error) {
                    //TODO show error message
                    console.error('Cannot create N3 metadata : ', error);
                } else {
                    content = angular.copy(result); 
                }
            });

            return content;
        }
    };
}]);
