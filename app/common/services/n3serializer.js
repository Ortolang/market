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
             'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
             'rdfs': 'http://www.w3.org/2000/01/rdf-schema#'};
    
    function isURL (entity) {
      return entity && entity.substr(0, 7) === 'http://';
    }

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

            var blankNodes = [];

            parser.parse(contentPurify,
                function (error, triple) {
                    if (triple) {

                        if(triple.subject==='info:otl/target') {

                            if (N3Util.isLiteral(triple.object)) {
                              mdFromN3[triple.predicate] = angular.copy(N3Util.getLiteralValue(triple.object));
                            } else {
                                if(N3Util.isBlank(triple.object)) {
                                    // mdFromN3[triple.predicate] = blankNode;
                                    blankNodes[triple.object] = [];
                                    mdFromN3[triple.predicate] = blankNodes[triple.object];
                                } else {
                                    mdFromN3[triple.predicate] = triple.object;
                                    
                                }
                            }
                        } else {
                            if(blankNodes[triple.subject]) {

                                if (triple.predicate===N3Util.expandQName('rdfs:member', prefixesRDF)) {

                                    // if(!angular.isArray(blankNodes[triple.subject])) {
                                    //     blankNodes[triple.subject] = [];
                                    // }

                                    if (N3Util.isLiteral(triple.object)) {
                                      blankNodes[triple.subject].push(angular.copy(N3Util.getLiteralValue(triple.object)));
                                    } else {
                                        // if(N3Util.isBlank(triple.object)) {
                                            // mdFromN3[triple.predicate] = blankNode;
                                            // blankNodeName = triple.object;
                                        // } else {
                                            blankNodes[triple.subject].push(triple.object);
                                            
                                        // }
                                    }
                                }
                            }
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

            if(!md[N3Util.expandQName('dc:identifier', prefixesRDF)]) {
                writer.addTriple('${target}', N3Util.expandQName('dc:identifier', prefixesRDF), '"${targetKey}"');
            }
            
            angular.forEach(md, function(valueElement, keyElement) {

                if(angular.isArray(valueElement)) {
                  if(valueElement.length>0) {
                    
                    var bag = '_:1';
                    writer.addTriple('${target}', keyElement, bag);
                    angular.forEach(valueElement, function(value) {
                        // Needs value to be object {id:..., name:...}
                        if (isURL(value)) {
                            writer.addTriple(bag, N3Util.expandQName('rdfs:member', prefixesRDF), value);
                        } else {
                            writer.addTriple(bag, N3Util.expandQName('rdfs:member', prefixesRDF), '"'+value+'"');
                        }
                    });
                  }
                } else {
                    if (isURL(valueElement)) {
                        writer.addTriple('${target}', keyElement, valueElement);
                    } else {
                        writer.addTriple('${target}', keyElement, '"'+valueElement+'"');
                    }
                }
            });

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
