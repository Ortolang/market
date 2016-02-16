'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FacetedFilterManager', ['QueryBuilderFactory', '$filter', function (QueryBuilderFactory, $filter) {

        // Constructor
        function FacetedFilterManager() {
            this.enabledFilters = [];
            this.availabledFilters = [];
            this.customProjections = [];
        }

        // Methods
        FacetedFilterManager.prototype = {

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
                        return this.enabledFilters;
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

            addCustomProjection: function (propertyName, propertyAlias) {
                this.customProjections.push({name: propertyName, alias: propertyAlias});
            },

            toAnalytics: function (content) {
                var result = content || '';
                angular.forEach($filter('orderBy')(this.enabledFilters, '+alias'), function (filter) {
                    if (filter.getPriority() === 'high' && filter.alias !== 'type') {
                        result += (result === '' ? '' : ' | ') + filter.toString();
                    }
                });
                return result;
            },

            toQuery: function (content) {
                var queryBuilder = QueryBuilderFactory.make({projection: 'key', source: 'collection'});

                queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

                queryBuilder.addProjection('meta_ortolang-item-json.type', 'type');
                queryBuilder.addProjection('meta_ortolang-item-json.title', 'title');
                // TODO ask for description only when view mode line
                queryBuilder.addProjection('meta_ortolang-item-json.description', 'description');
                queryBuilder.addProjection('meta_ortolang-item-json.image', 'image');
                queryBuilder.addProjection('meta_ortolang-item-json.applicationUrl', 'applicationUrl');
                queryBuilder.addProjection('meta_ortolang-item-json.publicationDate', 'publicationDate');
                queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');
                queryBuilder.addProjection('meta_ortolang-item-json.annotationLevels', 'annotationLevels');

                queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
                queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
                queryBuilder.addProjection('meta_ortolang-workspace-json.snapshotName', 'snapshotName');

                angular.forEach(this.customProjections, function (customProjection) {
                    queryBuilder.addProjection(customProjection.name, customProjection.alias);
                });

                queryBuilder.equals('status', 'published');
                queryBuilder.and().is_not_null('meta_ortolang-item-json.type');

                var contentSplit = [];
                if (content && content !== '') {
                    contentSplit = queryBuilder.tokenize(content);
                }
                if (contentSplit.length > 0) {
                    angular.forEach(contentSplit, function (contentPart) {
                        // queryBuilder.and().containsText('any()', contentPart);
                        queryBuilder.and().containsText(['meta_ortolang-item-json.description', 'meta_ortolang-item-json.title', 'meta_ortolang-item-json.type', 'meta_ortolang-item-json.keywords'], contentPart);
                        // The best solution : SELECT FROM Collection LET $temp = (   SELECT FROM (     TRAVERSE * FROM $current WHILE $depth <= 7   )   WHERE any().toLowerCase().indexOf('dede') > -1 ) WHERE $temp.size() > 0
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

        return {
            make: function () {
                return new FacetedFilterManager();
            }
        };

    }]);
