'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AtmosphereListener
 * @description
 * # AtmosphereListener
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AtmosphereListener', ['$rootScope', function ($rootScope) {

        function onMessage(response) {
            var responseText = response.responseBody,
                message;
            try {
                message = atmosphere.util.parseJSON(responseText);
                if (message.type) {
                    $rootScope.$emit(message.type, message);
                }
                console.log('ATMOSPHERE MESSAGE', message);
            } catch (e) {
                console.error('Error parsing JSON: ', responseText);
                throw e;
            }
        }

        return {
            onMessage: onMessage
        };
    }]);
