'use strict';

describe('Controller: SideNavCtrl', function () {

    // load the controller's module
    //beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var SideNavCtrl,
        sideNavElements,
        scope,
        rootScope,
        route,
        location,
        httpBackend;

    function changeLocation(template, path) {
        console.log(template, path);
        httpBackend.expectGET(template).respond(200);
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
        changeLocation('market/home.html', '/');

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
        httpBackend.flush();
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
        var workspaces = {
            template: 'workspace/workspaces.html',
            path: '/workspaces'
        };
        checkSelectedSideNavElement();
        changeLocation(workspaces.template, workspaces.path);
        httpBackend.flush();
        checkSelectedSideNavElement();
    });

});
