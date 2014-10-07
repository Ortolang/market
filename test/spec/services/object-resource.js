'use strict';

describe('Service: ObjectResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var ObjectResource;
    beforeEach(inject(function (_ObjectResource_) {
        ObjectResource = _ObjectResource_;
    }));

    it('should do something', function () {
        expect(!!ObjectResource).toBe(true);
    });

});
