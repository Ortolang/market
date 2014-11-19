'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.N3JS
 * @description
 * # N3JS
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketAppMock')
  .factory('N3Serializer', ['$q', 'sample', function ($q, sample) {
    
    function fromN3(content) {
        var defer = $q.defer();

        if(content === sample().sampleCode) {
            defer.resolve(sample().sampleN3);
        }

        return defer.promise;
    }

    return {
    	fromN3: fromN3
    }

}]);