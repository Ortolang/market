//'use strict';
//
//describe('Service: authService', function () {
//
//    // load the service's module
//    beforeEach(angular.mock.module('ortolangMarketApp'));
//
//    // instantiate service
//    var authService, httpBackend, urlPattern, urlPattern2, goodCredentials, badCredentials, user, locationService, successCallback, errorCallback, session;
//    beforeEach(inject(function (_AuthService_, _$httpBackend_, $location, _Session_) {
//        httpBackend = _$httpBackend_;
//        authService = _AuthService_;
//        locationService = $location;
//        session = _Session_;
//        successCallback = jasmine.createSpy();
//        errorCallback = jasmine.createSpy();
//        spyOn(session, 'create');
//        // definition des constantes pour valider les tests
//        urlPattern = new RegExp('http:\/\/.*\/api\/rest\/profiles\/connected');
//        goodCredentials = {
//            username: 'user1',
//            password: 'goodpwd'
//        };
//        urlPattern2 = new RegExp('http:\/\/.*\/api\/rest\/profiles\/' + goodCredentials.username);
//        badCredentials = {
//            username: 'user2',
//            password: 'badpwd'
//        };
//        user = {
//            email: 'user1@ortolang.org',
//            fullname: 'Good User',
//            status: 'ACTIVATED',
//            groups: {
//                0: 'wk1-members'
//            },
//            key: 'user1'
//        };
//    }));
//
//    afterEach(function () {
//        httpBackend.verifyNoOutstandingExpectation();
//        httpBackend.verifyNoOutstandingRequest();
//    });
//
////    it('should redirect to a new page', function () {
////        authService.redirectToAttemptedUrl();
////        expect(locationService.path()).not.toBe('/login');
////    });
////
////    it('should return a session if a registered user try to connect', function () {
////        var promise;
////        httpBackend.when('GET', urlPattern)
////            .respond(303, { Location: urlPattern2 });
////        httpBackend.expect('GET', urlPattern2)
////            .respond(200, { Response: user });
////
////        promise = authService.getSession(goodCredentials);
////        promise.then(successCallback, errorCallback);
////        httpBackend.flush();
////        expect(session.create).toHaveBeenCalled();
////        expect(successCallback).toHaveBeenCalled();
////        expect(errorCallback).not.toHaveBeenCalled();
////    });
////
////    it('should return an error if an unauthorized user try to connect', function () {
////        var promise;
////        httpBackend.expect('GET', urlPattern).respond(500);
////        promise = authService.getSession(badCredentials);
////        promise.then(successCallback, errorCallback);
////        httpBackend.flush();
////        expect(errorCallback).toHaveBeenCalled();
////    });
//});
