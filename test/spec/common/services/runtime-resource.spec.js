'use strict';

describe('Service: RuntimeResource', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // instantiate service
    var RuntimeResource;
    beforeEach(inject(function (_RuntimeResource_) {
        RuntimeResource = _RuntimeResource_;
    }));

    it('should do something', function () {
        expect(!!RuntimeResource).toBe(true);
    });

});
