'use strict';

describe('Service: WorkspaceElementResource', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));

    // instantiate service
    var WorkspaceElementResource;
    beforeEach(inject(function (_WorkspaceElementResource_) {
        WorkspaceElementResource = _WorkspaceElementResource_;
    }));

    it('should do something', function () {
        expect(!!WorkspaceElementResource).toBe(true);
    });

});
