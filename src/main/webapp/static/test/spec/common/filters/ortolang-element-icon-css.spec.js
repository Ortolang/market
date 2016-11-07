'use strict';

describe('Filter: elementIconCss', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    // initialize a new instance of the filter before each test
    var ortolangElementIconCss, icons;
    beforeEach(inject(function ($filter, _icons_) {
        ortolangElementIconCss = $filter('ortolangElementIconCss');
        icons = _icons_;
    }));

    it('should return unknown icon when type unknown or undefined', function () {
        expect(ortolangElementIconCss(undefined)).toBe(icons.ortolang.unknown);
        expect(ortolangElementIconCss('foo')).toBe(icons.ortolang.unknown);
    });

    it('should return collection icon when type collection', function () {
        expect(ortolangElementIconCss('collection')).toBe(icons.ortolang.collection);
    });

    it('should return object icon when type object', function () {
        expect(ortolangElementIconCss('object')).toBe(icons.ortolang.object);
    });

    it('should return metadata icon when type metadata', function () {
        expect(ortolangElementIconCss('metadata')).toBe(icons.ortolang.metadata);
    });
});
