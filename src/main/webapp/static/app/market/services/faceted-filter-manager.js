'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('FacetedFilterManager', ['QueryBuilderServiceProvider', function (QueryBuilderServiceProvider) {

        // Constructor
        function FacetedFilterManager(config) {
            this.enabledFilters = [];
            this.availabledFilters = [];

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }


        // Methods
        FacetedFilterManager.prototype = {

            getFilters: function() {
                return this.enabledFilters.slice();
            },

            addFilter : function (filter, opt) {
                filter.putSelectedOption(opt);

                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        return this.enabledFilters;
                    }
                }
                return this.enabledFilters.push(filter);
            },

            removeFilter: function(filter) {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        filter.clearSelectedOptions();
                        this.enabledFilters.splice(i, 1);
                        return this.getFilters();
                    }
                }
            },

            clear: function() {
                this.enabledFilters = [];
            },

            resetFilter: function() {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    this.enabledFilters[i].clearSelectedOptions();
                    delete this.enabledFilters[i];
                }
            },

            getAvailabledFilters: function() {
                return this.availabledFilters.slice();
            },

            addAvailabledFilter : function (filter) {
                var i = 0;
                for (i; i < this.availabledFilters.length; i++) {
                    if (this.availabledFilters[i].id === filter.id) {
                        return this.availabledFilters;
                    }
                }
                return this.availabledFilters.push(filter);
            },

            removeOptionFilter: function(filter, opt) {
                filter.removeSelectedOption(opt);

                if(!filter.hasSelectedOptions()) {
                    this.removeFilter(filter);
                }
            },

            urlParam: function (content, viewMode) {
            
                var filters = {}, params = {};
                angular.forEach(this.enabledFilters, function(filter) {

                    var arrValue = [];
                    angular.forEach(filter.getSelectedOptions(), function(opt) {
                        arrValue.push(opt.getValue());
                    });
                    
                    filters[filter.id] = arrValue;
                    
                });
                params.filters = angular.toJson(filters);

                //TODO add non filters to param
                if (content && content !== '') {
                    params.content = content;
                }
                params.viewMode = viewMode.id;

                return params; 
            },

            toQuery: function(content) {
                var queryBuilder = QueryBuilderServiceProvider.$get().make({
                    projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate', 
                    source: 'collection'
                });

                // TODO made based on availabled filters
                queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguages', 'corporaLanguages');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaType', 'corporaType');

                queryBuilder.addProjection('meta_ortolang-item-json.corporaFormats', 'corporaFormats');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaFileEncodings', 'corporaFileEncodings');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaDataTypes', 'corporaDataTypes');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguageType', 'corporaLanguageType');

                queryBuilder.addProjection('meta_ortolang-item-json.annotationLevels', 'annotationLevels');
                queryBuilder.addProjection('meta_ortolang-item-json.transcriptionType', 'transcriptionType');
                queryBuilder.addProjection('meta_ortolang-item-json.transcriptionFormat', 'transcriptionFormat');
                queryBuilder.addProjection('meta_ortolang-item-json.typeOfSpeech', 'typeOfSpeech');
                queryBuilder.addProjection('meta_ortolang-item-json.transcriptionEncoding', 'transcriptionEncoding');
                queryBuilder.addProjection('meta_ortolang-item-json.signal', 'signal');

                queryBuilder.addProjection('meta_ortolang-item-json.toolFunctionality', 'toolFunctionality');
                queryBuilder.addProjection('meta_ortolang-item-json.toolInputData', 'toolInputData');

                queryBuilder.equals('status', 'published');
                
                var contentSplit = [];
                if (content && content !== '') {
                    contentSplit = queryBuilder.tokenize(content);
                }
                if (contentSplit.length > 0) {
                    angular.forEach(contentSplit, function (contentPart) {
                        queryBuilder.and();
                        queryBuilder.containsText('any()', contentPart);
                    });
                }

                angular.forEach(this.enabledFilters, function(filter) {
                    queryBuilder.and();
                    if(filter.getType() ==='array') {
                        queryBuilder.in(filter.getId(), filter.getSelectedOptionsValues());
                    } else {
                        queryBuilder.equals(filter.getId(), filter.getSelectedOptionsValues());
                    }
                });

                return queryBuilder.toString();
            }
        };

        this.make = function (config) {
            return new FacetedFilterManager(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };
    }]);
