'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Suggester
 * @description
 * # Suggester
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').factory('Suggester', 
    ['$sce', '$q', '$translate', '$location', 'icons', 'Helper', 'SearchResource', function ($sce, $q, $translate, $location, icons, Helper, SearchResource) {

        function highlight(haystack, needle) {
            if (!needle) {
                return $sce.trustAsHtml(haystack);
            }
            return $sce.trustAsHtml(haystack.replace(new RegExp(needle, "gi"), function (match) {
                return '<strong>' + match + '</strong>';
            }));
        }

        function setSuggestionInHtml(suggestion, term) {
            var html = '<span class="search-history-item"><span class="fa ' + icons.suggestion[suggestion.type.toLowerCase()] + ' text-muted" aria-hidden="true"></span> ' +
                highlight(suggestion.label_fr, term);
            html += '</span>';
            return html;
        }

        return {
            suggest: function (term, type) {
                if (term.length < 2 || angular.isObject(term)) {
                    return [];
                }
                var deferred = $q.defer(),
                    paramUrl = {
                        'label_fr.autocomplete*': term,
                        'size': 50
                    };
                if (type) {
                    paramUrl['type'] = [$translate.instant('MARKET.SEARCH.RESOURCE_TYPE.' + type.toUpperCase()), 'Organization'];
                }
                SearchResource.suggest(paramUrl, function (results) {
                    var suggestions = [],
                        suggestionsMap = {},
                        suggestionTypes = ['Corpus', 'Lexique', 'Outil', 'Terminologie', 'Organization'];
                    for (var iResult = 0; iResult < results.length; iResult++) {
                        var entity = results[iResult],
                            suggestionsArray = (suggestionsMap[entity.type]) ? suggestionsMap[entity.type] : [];
                        var suggestionFound = Helper.findObjectOfArray(suggestions, 'id', entity.id);
                        if (suggestionFound == null) {
                            entity.html = setSuggestionInHtml(entity, term);
                            suggestionsArray.push(entity);
                            suggestionsMap[entity.type] = suggestionsArray;
                        }
                    }
                    for (var iSuggestionType = 0; iSuggestionType < suggestionTypes.length; iSuggestionType++) {
                        var suggestionName = suggestionTypes[iSuggestionType];
                        if (suggestionsMap.hasOwnProperty(suggestionName) && suggestionsMap[suggestionName]) {
                            var sugArray = suggestionsMap[suggestionName];
                            for (var iSuggestion = 0; iSuggestion < sugArray.length; iSuggestion++) {
                                suggestions.push(sugArray[iSuggestion]);
                            }
                        }
                    }
                    deferred.resolve(suggestions);
                }, function () {
                    deferred.reject([]);
                });
                return deferred.promise;
            },
            goToSearch: function (term, type, corporaType) {
                var params = {}, content = '', filters = {};
                if (type) {
                    filters.type = $translate.instant('MARKET.SEARCH.RESOURCE_TYPE.' + type.toUpperCase());
                }
                if (corporaType) {
                    filters['corporaType.id'] = corporaType;
                }
                if (term && angular.isDefined(term.path)) {
                    if (term.path === 'content') {
                        $location.path("/market/item/" + term.id);
                        return;
                    } else {
                        // filters[term.path] = term.id;
                        $location.path("/producers/" + term.id);
                        return;
                    }
                } else {
                    content = term;
                }
                params.filters = angular.toJson(filters);
                params.content = content;
                $location.search(params);
                $location.path("/market/search");
            }
        };
    }]);