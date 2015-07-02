'use strict';

describe('Service: Content', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var Content, httpBackend, url,
        forceDownloadQueryParam = '?fd=true';
    beforeEach(inject(function (_Content_, _$httpBackend_, _url_) {
        Content = _Content_;
        httpBackend = _$httpBackend_;
        url = _url_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the correct url', function () {
        expect(!!Content).toBe(true);
        expect(Content.getDownloadUrlWithKey('k1')).toBe(url.content + '/key/k1' + forceDownloadQueryParam);
        expect(Content.getDownloadUrlWithPath('<path>', '<alias>', '<root>')).toBe(url.content + '/<alias>/<root>/<path>' + forceDownloadQueryParam);
    });


    it('should download data', function () {

        httpBackend.whenGET(url.content + '/key/k1').respond('sample code');

        var promise = Content.downloadWithKey('k1'), theData;
        promise.then(function (data) {
            theData = data;
        });
        httpBackend.flush();
        expect(theData.data).toBe('sample code');
    });
});
