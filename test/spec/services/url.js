'use strict';

describe('Service: Url', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var Url;
    beforeEach(inject(function (_Url_) {
        Url = _Url_;
    }));

    it('should return url base', function () {
        expect(Url.urlBase).toBeDefined();
    });

});
