'use strict';

describe('Factory: Runtime', function () {

    // load the controller's module
    //beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var Runtime, RuntimeResource, sample, $rootScope, AuthService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$rootScope_, _RuntimeResource_, _Runtime_, _sample_, _AuthService_) {
        RuntimeResource = _RuntimeResource_;
        AuthService = _AuthService_;
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

});

