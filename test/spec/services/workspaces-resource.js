'use strict';

describe('Service: WorkspaceResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var WorkspaceResource;
    beforeEach(inject(function (_WorkspaceResource_) {
        WorkspaceResource = _WorkspaceResource_;
    }));

    it('should do something', function () {
        expect(!!WorkspaceResource).toBe(true);
    });

});
