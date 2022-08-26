'use strict';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.ortolangType
 * @description
 * # ortolangType
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('processStates', {
        pending: 'PENDING',
        submitted: 'SUBMITTED',
        running: 'RUNNING',
        suspended: 'SUSPENDED',
        aborted: 'ABORTED',
        completed: 'COMPLETED'
    });
