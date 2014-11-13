'use strict';

describe('Service: process', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var ProcessResource;
    beforeEach(inject(function (_ProcessResource_) {
        ProcessResource = _ProcessResource_;
    }));

    it('should do something', function () {
        expect(!!ProcessResource).toBe(true);
    });

});
