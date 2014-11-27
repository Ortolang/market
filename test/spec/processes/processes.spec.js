'use strict';

describe('Controller: ProcessesCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));
    beforeEach(module('processes/process-log-modal-template.html'));

    var ProcessesCtrl, scope, RuntimeResource, sample, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _RuntimeResource_, $modal, _sample_, _$httpBackend_) {
        scope = $rootScope.$new();
        sample = _sample_;
        $httpBackend = _$httpBackend_;
        RuntimeResource = _RuntimeResource_;
        ProcessesCtrl = $controller('ProcessesCtrl', {
            $scope: scope,
            RuntimeResource: RuntimeResource,
            $modal: $modal
        });
    }));

    it('should have a ProcessesCtrl controller', function () {
        expect(ProcessesCtrl).toBeDefined();
    });

});

