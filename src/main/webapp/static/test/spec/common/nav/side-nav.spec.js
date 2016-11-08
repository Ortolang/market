'use strict';

describe('Controller: SideNavCtrl', function () {

    // load the controller's module
    //beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    var SideNavCtrl,
        sideNavElements,
        scope,
        rootScope,
        route,
        location,
        httpBackend;

    function changeLocation(path) {
        location.path(path);
        rootScope.$digest();
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $route, $location, $httpBackend, _sideNavElements_) {
        sideNavElements = _sideNavElements_;
        scope = $rootScope.$new();
        rootScope = $rootScope;
        route = $route;
        location = $location;
        httpBackend = $httpBackend;

        expect(route.current).toBeUndefined();
        changeLocation('/');

        SideNavCtrl = $controller('SideNavCtrl', {
            $scope: scope,
            sideNavElements: sideNavElements
        });
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should have a list of navigation elements', function () {
        expect(scope.sideNavElements).toBeDefined();
    });

    function checkSelectedSideNavElement() {
        angular.forEach(rootScope.sideNavElements, function (element) {
            if (element.path === location.path()) {
                expect(element.active).toEqual('active');
            } else {
                expect(element.active).toBeUndefined();
            }
        });
    }

    it('should select the right sideNavElements according to the route', function () {
        checkSelectedSideNavElement();
        changeLocation('/workspaces');
        checkSelectedSideNavElement();
    });

});
