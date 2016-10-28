'use strict';

describe('Filter: bytes', function () {

    // load the filter's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    // initialize a new instance of the filter before each test
    var bytes;
    beforeEach(inject(function ($filter) {
        bytes = $filter('bytes');
    }));

    it('should return nothing when there is no filesize', function () {
        expect(bytes('text')).toBe('-');
    });

    it('should return nothing when filesize is equal zero', function () {
        expect(bytes(0)).toBe('-');
    });

    it('should round the filesize based on the configured precision', function () {
        var size = 1024 + 512;
        expect(bytes(size)).toBe('1.5 Ko');
        expect(bytes(size, 2)).toBe('1.50 Ko');
    });

    it('should recognize bytes', function () {
        expect(bytes(1.000, 0)).toBe('1 octets');
    });

    it('should recognize KiloBytes', function () {
        expect(bytes(Math.pow(1024, 1), 0)).toBe('1 Ko');
    });

    it('should recognize MegaBytes', function () {
        expect(bytes(Math.pow(1024, 2), 0)).toBe('1 Mo');
    });

    it('should recognize GigaBytes', function () {
        expect(bytes(Math.pow(1024, 3), 0)).toBe('1 Go');
    });

    it('should recognize TeraBytes', function () {
        expect(bytes(Math.pow(1024, 4), 0)).toBe('1 To');
    });

    it('should recognize PetaBytes', function () {
        expect(bytes(Math.pow(1024, 5), 0)).toBe('1 Po');
    });

});
