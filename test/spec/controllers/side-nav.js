'use strict';

describe('Controller: SideNavCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var SideNavCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        SideNavCtrl = $controller('SideNavCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of nav elements to the scope', function () {
        expect(scope.navElements.length).toBeGreaterThan(2);
    });
});
