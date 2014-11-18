'use strict';

describe('Service: DownloadResource', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var DownloadResource, httpBackend;
    beforeEach(inject(function (_DownloadResource_, _$httpBackend_) {
        DownloadResource = _DownloadResource_;
        httpBackend = _$httpBackend_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the correct url', function () {
        expect(!!DownloadResource).toBe(true);
        console.debug('DownlaodResource');
        var params = {oKey: 'k1'};
        expect(DownloadResource.getDownloadUrl(params)).toBe('http://localhost:8080/api/rest/objects/k1/download');

        params = {wsName: '<wsname>', path: '<path>', root: '<root>', metadata: '<metadata>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe('http://localhost:8080/api/rest/workspaces/<wsname>/download?path=<path>&root=<root>&metadata=<metadata>');
        params = {wsName: '<wsname>'};
        expect(DownloadResource.getDownloadUrl(params)).toBe('http://localhost:8080/api/rest/workspaces/<wsname>/download?');

        params = {};
        expect(DownloadResource.getDownloadUrl(params)).toBe(undefined);
    });


    it('should download data', function () {
        var params = {oKey: 'k1'};

        httpBackend.whenGET('http://localhost:8080/api/rest/objects/k1/download').respond('sample code');

        var promise = DownloadResource.download(params, {}), theData;
        promise.then(function (data) {
            theData = data;
        });
        httpBackend.flush();
        expect(theData.data).toBe('sample code');
    });
});
