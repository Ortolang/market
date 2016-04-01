'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SpecificFieldsCtrl
 * @description
 * # SpecificFieldsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SpecificFieldsCtrl', ['$rootScope', '$scope', '$filter', 'Settings', 'Helper', '$q', 'ReferentialEntityResource',
        function ($rootScope, $scope, $filter, Settings, Helper, $q, ReferentialEntityResource) {

            $scope.suggestLanguages = function (term) {
                if(term.length<2) {
                    return [];
                }
                var lang = Settings.language;
                var deferred = $q.defer();
                // allLanguages : {id: XX, label: YY}
                ReferentialEntityResource.get({type: 'LANGUAGE', lang:lang.toUpperCase(),term: term}, function(results) {
                    var suggestedLanguages = [];
                    angular.forEach(results.entries, function(refentity) {
                        var content = angular.fromJson(refentity.content);
                        var text = Helper.getMultilingualValue(content.labels);
                        if(text) {
                            suggestedLanguages.push({id: Helper.createKeyFromReferentialId(refentity.key), label: text});
                        }
                    });
                    deferred.resolve(suggestedLanguages);
                }, function (reason) {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.addLanguage = function(name, tag) {
                if(angular.isUndefined($scope.metadata[name])) {
                    $scope.metadata[name] = [];
                }
                if(angular.isDefined(tag.id)) {
                   $scope.metadata[name].push(tag.id);
                } else {
                    $scope.metadata[name].push(tag.label);
                }
            };

            $scope.removeLanguage = function(name, tag) {
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata[name].indexOf(value);
                if (index > -1) {
                    $scope.metadata[name].splice(index, 1);
                }
            };

            function loadLanguage(name) {
                // Array of the selected language
                $scope[name] = [];
                if(angular.isDefined($scope.metadata[name])) {
                    angular.forEach($scope.metadata[name], function(lang) {
                        ReferentialEntityResource.get({name:Helper.extractNameFromReferentialId(lang)}, function (entity) {
                            var content = angular.fromJson(entity.content);
                            $scope[name].push({id: Helper.createKeyFromReferentialId(entity.key), label: Helper.getMultilingualValue(content.labels)});
                        },
                        function () {
                            $scope[name].push({id:lang,label:lang});
                        });
                    });
                }
            }

            function addTerms(compatibility, arrayName) {

                $scope[arrayName] = [];

                ReferentialEntityResource.get({type: compatibility.toUpperCase()}, function(entities) {
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);

                        var entity = {id: Helper.createKeyFromReferentialId(entry.key), label: Helper.getMultilingualValue(content.labels)};
                        if(content.rank) {
                            entity.rank = content.rank;
                        }
                        if(content.compatibilities) {
                            entity.compatibilities = content.compatibilities;
                        }
                        $scope[arrayName].push(entity);
                    });
                });
            }

            /**
             * Initialize the scope
             **/

        	function init() {
                addTerms('LanguageType', 'allLanguageType');
                addTerms('CorporaType', 'allCorporaType');
                addTerms('CorporaStyle', 'allCorporaStyles');
                addTerms('AnnotationLevel', 'allAnnotationLevels');
                loadLanguage('corporaLanguages');
                loadLanguage('corporaStudyLanguages');
                loadLanguage('lexiconInputLanguages');
                loadLanguage('lexiconDescriptionLanguages');
                loadLanguage('toolLanguages');
                loadLanguage('navigationLanguages');
                addTerms('FileFormat', 'allFileFormats');
                addTerms('FileEncoding', 'allFileEncodings');
                addTerms('DataType', 'allDataTypes');
                addTerms('LexiconAnnotation', 'allLexiconAnnotations');
                addTerms('OperatingSystem', 'allOperatingSystems');
                addTerms('ProgrammingLanguage', 'allProgrammingLanguages');
                addTerms('ToolSupport', 'allToolSupports');
                addTerms('ToolFunctionality', 'allToolFunctionalities');
            }
            init();
}]);