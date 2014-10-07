'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var LoginCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope
        });
    }));

    it('should have a LoginCtrl controller', function () {
        expect(LoginCtrl).toBeDefined();
    });

    it('should get username and password', function () {
        expect(scope.credentials).toBeDefined();
        expect(scope.credentials.username).toBeDefined();
        expect(scope.credentials.password).toBeDefined();
    });


});

