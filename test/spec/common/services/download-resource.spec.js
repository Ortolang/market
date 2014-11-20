'use strict';

describe('Service: DownloadResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var DownloadResource, httpBackend, Url;
    beforeEach(inject(function (_DownloadResource_, _$httpBackend_, _Url_) {
        DownloadResource = _DownloadResource_;
        httpBackend = _$httpBackend_;
        Url = _Url_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the correct url', function () {
        expect(!!DownloadResource).toBe(true);

        var params = {oKey: 'k1'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(Url.urlBase() + '/rest/objects/k1/download');

        params = {wskey: '<wskey>', path: '<path>', root: '<root>', metadata: '<metadata>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(Url.urlBase() + '/rest/workspaces/<wskey>/download?path=<path>&root=<root>&metadata=<metadata>');
        params = {wskey: '<wskey>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe(Url.urlBase() + '/rest/workspaces/<wskey>/download?');

        params = {};
        expect(DownloadResource.getDownloadUrl(params)).toBe(undefined);
    });


    it('should download data', function () {
        var params = {oKey: 'k1'};

        httpBackend.whenGET(Url.urlBase() + '/rest/objects/k1/download').respond('sample code');

        var promise = DownloadResource.download(params, {}), theData;
        promise.then(function (data) {
            theData = data;
        });
        httpBackend.flush();
        expect(theData.data).toBe('sample code');
    });
});
