'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.ProfileResource
 * @description
 * # ProfileResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('ProfileResource', [ '$q', 'sample', function ($q, sample) {

        function read() {
            var defer = $q.defer();
            defer.resolve(sample().profile);
            return {$promise: defer.promise};
        }

        function getCard() {
            var defer = $q.defer();
            defer.resolve(sample().profileCard);
            return {$promise: defer.promise};
        }

        return {
            read: read,
            getCard: getCard
        };
    }]);
