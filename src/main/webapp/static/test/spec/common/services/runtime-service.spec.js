'use strict';

describe('Factory: Runtime', function () {

    // load the controller's module
    //beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var Runtime, RuntimeResource, sample, $rootScope, AuthService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _RuntimeResource_, _Runtime_, _sample_, _AuthServiceMock_) {
        RuntimeResource = _RuntimeResource_;
        AuthService = _AuthServiceMock_;
        Runtime = _Runtime_;
        sample = _sample_;
        $rootScope = _$rootScope_;
        // $apply for session initialisation to be completed
        $rootScope.$apply();
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
        Runtime.createProcess('completedProcess');
        $rootScope.$apply();
        expect(Runtime.hasActiveProcesses()).toBe(false);
        Runtime.createProcess('pendingProcess');
        $rootScope.$apply();
        expect(Runtime.hasActiveProcesses()).toBe(true);
        Runtime.createProcess('runningProcess');
        $rootScope.$apply();
        expect(Runtime.hasActiveProcesses()).toBe(true);
    });

    it('should be possible to know if there are some processes of a given type', function () {
        var states = Runtime.getStates();
        expect(Runtime.hasProcessesWithState).toBeDefined();
        Runtime.createProcess('pendingProcess');
        $rootScope.$apply();
        expect(Runtime.hasProcessesWithState(states.pending)).toBe(true);
        expect(Runtime.hasProcessesWithState(states.completed)).toBe(false);
        expect(Runtime.hasProcessesWithState(states.running)).toBe(false);
        Runtime.createProcess('completedProcess');
        $rootScope.$apply();
        expect(Runtime.hasProcessesWithState(states.completed)).toBe(true);
        expect(Runtime.hasProcessesWithState('TOTO')).toBe(false);
        Runtime.createProcess('runningProcess');
        $rootScope.$apply();
        expect(Runtime.hasProcessesWithState(states.running)).toBe(true);
    });

});

