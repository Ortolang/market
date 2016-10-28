'use strict';

describe('Constant: ortolangType', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var ortolangType;
    beforeEach(inject(function (_ortolangType_) {
        ortolangType = _ortolangType_;
    }));

    it('should return object type', function () {
        expect(ortolangType.object).toBeDefined();
        expect(ortolangType.object).toBe('object');
    });

    it('should return collection type', function () {
        expect(ortolangType.collection).toBeDefined();
        expect(ortolangType.collection).toBe('collection');
    });

    it('should return metadata type', function () {
        expect(ortolangType.metadata).toBeDefined();
        expect(ortolangType.metadata).toBe('metadata');
    });

    it('should return link type', function () {
        expect(ortolangType.link).toBeDefined();
        expect(ortolangType.link).toBe('link');
    });
});
