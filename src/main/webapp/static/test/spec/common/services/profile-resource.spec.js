'use strict';

describe('Service: ProfileResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var ProfileResource;
    beforeEach(inject(function (_ProfileResource_) {
        ProfileResource = _ProfileResource_;
    }));

    afterEach(function () {
        inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    it('should exist', function () {
        expect(!!ProfileResource).toBe(true);
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
