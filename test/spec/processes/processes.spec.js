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

    //it('should have a list of possible states', function () {
    //    expect(scope.states).toBeDefined();
    //    expect(scope.states.pending).toEqual('PENDING');
    //    expect(scope.states.submitted).toEqual('SUBMITTED');
    //    expect(scope.states.running).toEqual('RUNNING');
    //    expect(scope.states.suspended).toEqual('SUSPENDED');
    //    expect(scope.states.aborted).toEqual('ABORTED');
    //    expect(scope.states.completed).toEqual('COMPLETED');
    //});
    //
    //it('should be possible to know if there are some active processes', function () {
    //    expect(scope.hasActiveProcesses).toBeDefined();
    //    expect(scope.hasActiveProcesses()).toBe(false);
    //    scope.processes = {entries: [sample().pendingProcess], $resolved: true};
    //    expect(scope.hasActiveProcesses()).toBe(true);
    //});
    //
    //it('should be possible to know if there are some processes of a given type', function () {
    //    expect(scope.hasProcessesOfType).toBeDefined();
    //    scope.processes = {entries: [sample().completedProcess, sample().pendingProcess], $resolved: true};
    //    expect(scope.hasProcessesOfType('completed')).toBe(true);
    //    expect(scope.hasProcessesOfType('pending')).toBe(true);
    //    expect(scope.hasProcessesOfType('aborted')).toBe(false);
    //    expect(scope.hasProcessesOfType('toto')).toBe(false);
    //});

});

