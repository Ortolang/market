'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FacetedFilterManager', ['QueryBuilderFactory', function (QueryBuilderFactory) {

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

            getFilters: function () {
                return this.enabledFilters.slice();
            },

            addFilter : function (filter) {

                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        return this.enabledFilters;
                    }
                }
                return this.enabledFilters.push(filter);
            },

            removeFilter: function (filter) {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        filter.clearSelectedOptions();
                        this.enabledFilters.splice(i, 1);
                        return this.getFilters();
                    }
                }
            },

            clear: function () {
                this.enabledFilters = [];
            },

            resetFilter: function () {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    this.enabledFilters[i].clearSelectedOptions();
                    delete this.enabledFilters[i];
                }
                this.enabledFilters = [];
            },

            getAvailableFilters: function () {
                return this.availabledFilters.slice();
            },

            addAvailableFilter : function (filter) {
                var i = 0;
                for (i; i < this.availabledFilters.length; i++) {
                    if (this.availabledFilters[i].id === filter.id) {
                        return this.availabledFilters;
                    }
                }
                return this.availabledFilters.push(filter);
            },

            removeOptionFilter: function (filter, opt) {
                filter.removeSelectedOption(opt);

                if (!filter.hasSelectedOptions()) {
                    this.removeFilter(filter);
                }
            },

            urlParam: function (content, viewMode, orderProp, orderDirection, facets) {

                var filters = {}, params = {};
                angular.forEach(this.enabledFilters, function (filter) {

                    var arrValue = [];
                    angular.forEach(filter.getSelectedOptions(), function (opt) {
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
                params.orderProp = orderProp.id;
                params.orderDirection = orderDirection;
                params.facets = facets.toString();

                return params;
            },

            toQuery: function (content) {
                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate',
                    source: 'collection'
                });

                // TODO made based on available filters
                queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguages', 'corporaLanguages');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaType', 'corporaType');

                queryBuilder.addProjection('meta_ortolang-item-json.corporaFormats', 'corporaFormats');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaFileEncodings', 'corporaFileEncodings');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaDataTypes', 'corporaDataTypes');
                queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguageType', 'corporaLanguageType');

                queryBuilder.addProjection('meta_ortolang-item-json.annotationLevels', 'annotationLevels');

                queryBuilder.addProjection('meta_ortolang-item-json.toolLanguages', 'toolLanguages');
                queryBuilder.addProjection('meta_ortolang-item-json.toolFunctionalities', 'toolFunctionalities');
                queryBuilder.addProjection('meta_ortolang-item-json.toolInputData', 'toolInputData');
                queryBuilder.addProjection('meta_ortolang-item-json.toolOutputData', 'toolOutputData');
                queryBuilder.addProjection('meta_ortolang-item-json.toolFileEncodings', 'toolFileEncodings');

                queryBuilder.addProjection('meta_ortolang-item-json.lexiconInputType', 'lexiconInputType');
                queryBuilder.addProjection('meta_ortolang-item-json.lexiconDescriptionTypes', 'lexiconDescriptionTypes');
                queryBuilder.addProjection('meta_ortolang-item-json.lexiconInputLanguages', 'lexiconInputLanguages');
                queryBuilder.addProjection('meta_ortolang-item-json.lexiconDescriptionLanguages', 'lexiconDescriptionLanguages');
                queryBuilder.addProjection('meta_ortolang-item-json.lexiconFormats', 'lexiconFormats');
                queryBuilder.addProjection('meta_ortolang-item-json.lexiconLanguageType', 'lexiconLanguageType');

                queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
                queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
                queryBuilder.addProjection('meta_ortolang-workspace-json.versionName', 'version');
                queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

                queryBuilder.equals('status', 'published');

                var contentSplit = [];
                if (content && content !== '') {
                    contentSplit = queryBuilder.tokenize(content);
                }
                if (contentSplit.length > 0) {
                    angular.forEach(contentSplit, function (contentPart) {
                        queryBuilder.and().containsText('any()', contentPart);
                    });
                }

                angular.forEach(this.enabledFilters, function (filter) {
                    queryBuilder.and();
                    if (filter.getType() === 'array') {
                        queryBuilder.in(filter.getId(), filter.getSelectedOptionsValues());
                    } else {
                        queryBuilder.equals(filter.getId(), filter.getSelectedOptionsValues());
                    }
                });

                return queryBuilder.toString();
            }
        };

        function make(config) {
            return new FacetedFilterManager(config);
        }

        return {
            make: make
        };

    }]);
