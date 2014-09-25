'use strict';

describe('Filter: iconFullClass', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));

    // initialize a new instance of the filter before each test
    var iconFullClass;
    beforeEach(inject(function ($filter) {
        iconFullClass = $filter('iconFullClass');
    }));

});
