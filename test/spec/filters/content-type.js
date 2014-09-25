'use strict';

describe('Filter: contentType', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));

    // initialize a new instance of the filter before each test
    var contentType;
    beforeEach(inject(function ($filter) {
        contentType = $filter('contentType');
    }));

});
