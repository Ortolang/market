'use strict';

describe('Filter: breakLineFilter', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));

    // initialize a new instance of the filter before each test
    var breakLineFilter;
    beforeEach(inject(function ($filter) {
        breakLineFilter = $filter('breakLineFilter');
    }));

    it('should do something', function () {
        expect(!!breakLineFilter).toBe(true);
    });

});
