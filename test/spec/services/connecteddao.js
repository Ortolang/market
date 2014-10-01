'use strict';

describe('Service: ConnectedDAO', function () {

//    // load the service's module
//    beforeEach(module('ortolangMarketApp'));
//
//    // instantiate service
//    var ConnectedDAO;
//    beforeEach(inject(function (_ConnectedDAO_) {
//        ConnectedDAO = _ConnectedDAO_;
//    }));
//
//    it('should exist', function () {
//        expect(!!ConnectedDAO).toBe(true);
//    });
//
//});
    beforeEach(function () {
        module('ortolangMarketApp');
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    // instantiate service
    var ConnectedDAO;
    beforeEach(inject(function (_ConnectedDAO_) {
        ConnectedDAO = _ConnectedDAO_;
    }));

    afterEach(function () {
        inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('Service: ConnectedDAO', function () {
        it('should exist', function () {
            expect(!!ConnectedDAO).toBe(true);
        });

//        it('should work',
//            inject(['$httpBackend',
//                function ($httpBackend) {
//                    var result, urlPattern = new RegExp('http:\/\/.*\/api\/rest\/profiles\/connected');
//                    $httpBackend.expect('GET', urlPattern).respond(303);
//                    result = ConnectedDAO.query();
//                    $httpBackend.flush();
//                    //console.debug(result);
//                    //expect(result.Response).toEqualData(user);
//                }])
//            );
    });
});