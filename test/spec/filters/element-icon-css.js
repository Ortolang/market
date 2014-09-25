'use strict';

describe('Filter: elementIconCss', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));

    // initialize a new instance of the filter before each test
    var elementIconCss;
    beforeEach(inject(function ($filter) {
        elementIconCss = $filter('elementIconCss');
    }));

});
