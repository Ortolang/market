'use strict';

describe('Service: ObjectResource', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // instantiate service
    var ObjectResource;
    beforeEach(inject(function (_ObjectResource_) {
        ObjectResource = _ObjectResource_;
    }));

    it('should do something', function () {
        expect(!!ObjectResource).toBe(true);
    });

});
