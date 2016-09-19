'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataFormat
 * @description
 * # MetadataFormat
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MetadataFormat', function () {

        return function (data) {
            angular.extend(this, {
                id: '',
                name: '',
                format: '',
                view: '',

                isCompatible: function (format) {
                    return this.format === format;
                }
            }, data);
        };
    });
