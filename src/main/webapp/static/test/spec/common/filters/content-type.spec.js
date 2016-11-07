'use strict';

describe('Filter: contentType', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    // initialize a new instance of the filter before each test
    var contentType;
    beforeEach(inject(function ($filter) {
        contentType = $filter('contentType');
    }));

    it('should return collection for "ortolang/collection"', function () {
        expect(contentType('ortolang/collection')).toBe('collection');
    });

    it('should return input as is if not equal to "ortolang/collection"', function () {
        expect(contentType(undefined)).toBe(undefined);
        expect(contentType('text/plain')).toBe('text/plain');
        expect(contentType('foo')).toBe('foo');
    });
});
