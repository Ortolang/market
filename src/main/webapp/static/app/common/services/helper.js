'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Settings
 * @description
 * # Settings
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Helper', ['Settings', function (Settings) {

        this.getMultilingualValue = function (multilingualProperty, language) {
            var i;
            language = language || Settings.language;
            for (i = 0; i < multilingualProperty.length; i++) {
                if (multilingualProperty[i].lang === language) {
                    return multilingualProperty[i].value;
                }
            }
            return multilingualProperty.length > 0 ? multilingualProperty[0].value : undefined;
        };

        this.extractKeyFromReferentialId = function (key) {
            // Pattern : ${key}
            return key.substring(2, key.length-1);
        };

        this.extractNameFromReferentialId = function (id) {
            // Pattern : ${referential:name}
            var key = this.extractKeyFromReferentialId(id);
            return key.split(':').pop();
        };

        this.startsWith = function (actual, expected) {
            var lowerStr = (actual + '').toLowerCase();
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        };

        this.endsWith = function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        return this;
    }]);
