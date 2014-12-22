'use strict';

describe('Controller: SideNavCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var SideNavCtrl,
        scope,
        rootScope,
        route,
        location,
        httpBackend;

    function changeLocation(template, path) {
        console.debug(template, path);
        httpBackend.expectGET(template).respond(200);
        location.path(path);
        rootScope.$digest();
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $route, $location, $httpBackend) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        route = $route;
        location = $location;
        httpBackend = $httpBackend;
        httpBackend.when('GET', '/market').respond({userId: 'userX'}, {'A-Token': 'xxx'});

        expect(route.current).toBeUndefined();
        changeLocation('market/market-home.html', '/market');

        SideNavCtrl = $controller('SideNavCtrl', {
            $scope: scope
        });
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

//    it('should have a list of navigation elements', function () {
//        expect(scope.navElements).toBeDefined();
//    });

//    it('should select the right navElements according to the route', function () {
//        var testRoutes = [
//            {
//                template: 'market/market-home.html',
//                path: '/market'
//            },
//            {
//                template: 'views/browser.html',
//                path: '/workspaces/system/head///browse'
//            }];
//        angular.forEach(testRoutes, function (testRoute) {
//            changeLocation(testRoute.template, testRoute.path);
//            angular.forEach(scope.navElements, function (element) {
//                if (element.path === location.path) {
//                    expect(element.active).toEqual('active');
//                } else {
//                    expect(element.active).toBeUndefined();
//                }
//            });
//        });
//    });

});
