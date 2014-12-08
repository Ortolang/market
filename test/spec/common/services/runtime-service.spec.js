'use strict';

describe('Factory: Runtime', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var Runtime, sample, $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _Runtime_, _sample_) {
        Runtime = _Runtime_;
        sample = _sample_;
        $rootScope = _$rootScope_;
    }));

    it('should have a list of possible states', function () {
        var states = Runtime.getStates();
        expect(states).toBeDefined();
        expect(states.pending).toEqual('PENDING');
        expect(states.submitted).toEqual('SUBMITTED');
        expect(states.running).toEqual('RUNNING');
        expect(states.suspended).toEqual('SUSPENDED');
        expect(states.aborted).toEqual('ABORTED');
        expect(states.completed).toEqual('COMPLETED');
    });

    it('should be possible to know if there are some active processes', function () {
        expect(Runtime.hasActiveProcesses).toBeDefined();
        expect(Runtime.hasActiveProcesses()).toBe(false);
        $rootScope.processes = [sample().pendingProcess];
        expect(Runtime.hasActiveProcesses()).toBe(true);
    });

    it('should be possible to know if there are some processes of a given type', function () {
        var states = Runtime.getStates();
        expect(Runtime.hasProcessesWithState()).toBeDefined();
        $rootScope.processes = [sample().completedProcess, sample().pendingProcess];
    //    expect(Runtime.hasProcessesWithState(states.completed)).toBe(true);
    //    expect(Runtime.hasProcessesWithState(states.pending)).toBe(true);
    //    expect(Runtime.hasProcessesWithState(states.aborted)).toBe(false);
    //    expect(Runtime.hasProcessesWithState('TOTO')).toBe(false);
    });

});

