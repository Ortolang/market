'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataManager
 * @description
 * # MetadataManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
  .factory('MetadataManager', function () {
    
    var metadataMap = [];

    // Public API here
    return {
        /**
         * Returns the metadata map.
         * @return {object} an object representing a map
         */
        'getMetadataMap': function () {
            return metadataMap;
        },

        'getMetadata': function (mdId) {
            angular.forEach(metadataMap, function(md) {
                if(md.id === mdId) {
                    return md;
                }
            });
            return undefined;
        },
        'getCompatibleMetadataEditor': function (format) {
           var compatibleEditors = [];
            angular.forEach(metadataMap, function (metadataEditor) {
                if (metadataEditor.isCompatible(format)) {
                    this.push(metadataEditor);
                }
            }, compatibleEditors);
            return compatibleEditors;
        },
    };
});
