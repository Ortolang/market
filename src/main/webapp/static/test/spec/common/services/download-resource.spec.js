'use strict';

describe('Service: DownloadResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var DownloadResource, httpBackend, url;
    beforeEach(inject(function (_DownloadResource_, _$httpBackend_, _url_) {
        DownloadResource = _DownloadResource_;
        httpBackend = _$httpBackend_;
        url = _url_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the correct url', function () {
        expect(!!DownloadResource).toBe(true);

        var params = {key: 'k1'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(url.api + '/objects/k1/download');

        params = {wskey: '<wskey>', path: '<path>', root: '<root>', metadata: '<metadata>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(url.api + '/workspaces/<wskey>/download?path=<path>&root=<root>&metadata=<metadata>');
        params = {wskey: '<wskey>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(url.api + '/workspaces/<wskey>/download?');

        params = {};
        expect(DownloadResource.getDownloadUrl(params)).toBe(undefined);
    });


    it('should download data', function () {
        var params = {key: 'k1'};

        httpBackend.whenGET(url.api + '/objects/k1/download').respond('sample code');

        var promise = DownloadResource.download(params, {}), theData;
        promise.then(function (data) {
            theData = data;
        });
        httpBackend.flush();
        expect(theData.data).toBe('sample code');
    });
});
