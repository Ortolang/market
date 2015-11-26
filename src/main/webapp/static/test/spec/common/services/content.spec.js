'use strict';

describe('Service: Content', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var Content, httpBackend, url,
        forceDownloadQueryParam = '?fd=true',
        thumbSizeQueryParam = '?size=';

    beforeEach(inject(function (_Content_, _$httpBackend_, _url_) {
        Content = _Content_;
        httpBackend = _$httpBackend_;
        url = _url_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the content url', function () {
        expect(!!Content).toBe(true);
        expect(Content.getContentUrlWithKey('k1')).toBe(url.content + '/key/k1');
        expect(Content.getContentUrlWithPath('<path>', '<alias>', undefined)).toBe(url.content + '/<alias>/head/<path>');
        expect(Content.getContentUrlWithPath('<path>', '<alias>', '<root>')).toBe(url.content + '/<alias>/<root>/<path>');
        expect(Content.getContentUrlWithPath('<path>', '<alias>', '<root>', true)).toBe(url.contentNoSSL + '/<alias>/<root>/<path>');
    });

    it('should return the preview url', function () {
        var expectedUrl = url.api + '/thumb/k1';
        expect(Content.getPreviewUrlWithKey('k1')).toBe(expectedUrl);
        expect(Content.getPreviewUrlWithKey('k1', '<size>')).toBe(expectedUrl + thumbSizeQueryParam + '<size>');
        expectedUrl = expectedUrl.replace(url.api, url.apiNoSSL);
        expect(Content.getPreviewUrlWithKey('k1', '<size>', true)).toBe(expectedUrl + thumbSizeQueryParam + '<size>');
    });

    it('should return the download url', function () {
        var expectedUrl = Content.getContentUrlWithKey('k1') + forceDownloadQueryParam;
        expect(Content.getDownloadUrlWithKey('k1')).toBe(expectedUrl);
        expectedUrl = Content.getContentUrlWithPath('<path>', '<alias>', '<root>') + forceDownloadQueryParam;
        expect(Content.getDownloadUrlWithPath('<path>', '<alias>', '<root>')).toBe(expectedUrl);
        expectedUrl = expectedUrl.replace(url.content, url.contentNoSSL);
        expect(Content.getDownloadUrlWithPath('<path>', '<alias>', '<root>', true)).toBe(expectedUrl);
    });

    it('should return the export url', function () {
        var expectedUrl = url.content + '/export?&path=/<path>&path=/<path2>';
        expect(Content.getExportUrl(['<path>', '<path2>'])).toBe(expectedUrl);
        expectedUrl += '&filename=<filename>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>')).toBe(expectedUrl);
        expectedUrl += '&format=<format>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>')).toBe(expectedUrl);
        expectedUrl += '&followsymlink=<followsymlink>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>', '<followsymlink>')).toBe(expectedUrl);
        expectedUrl = expectedUrl.replace(url.content, url.contentNoSSL);
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>', '<followsymlink>', true)).toBe(expectedUrl);
    });

    it('should download data', function () {
        httpBackend.whenGET(url.content + '/key/k1').respond('sample code');

        var contentDownload = Content.downloadWithKey('k1'), theData;
        contentDownload.promise.then(function (data) {
            theData = data;
        });
        httpBackend.flush();
        expect(theData.data).toBe('sample code');
    });
});
