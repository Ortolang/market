'use strict';

describe('Constant: url', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    var url;
    beforeEach(inject(function (_url_) {
        url = _url_;
    }));

    it('should return api server url', function () {
        expect(url.api).toBeDefined();
    });

    it('should return sub server url', function () {
        expect(url.sub).toBeDefined();
    });

    it('should return content url', function () {
        expect(url.content).toBeDefined();
    });

    it('should return content url without SSL', function () {
        expect(url.contentNoSSL).toBeDefined();
    });

});
