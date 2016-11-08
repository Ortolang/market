'use strict';

describe('Service: MetadataManager', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // instantiate service
    var MetadataManager;
    beforeEach(inject(function (_MetadataManager_) {
        MetadataManager = _MetadataManager_;

        MetadataManager.getMetadataMap().push();
    }));

    it('MetadataManager : should return an empty object', function () {
        expect(!!MetadataManager).toBe(true);

        //export(MetadataManager.getMetadataMap()).toBe({});
    });

});
