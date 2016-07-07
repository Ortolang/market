'use strict';

describe('Service: Content', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    // instantiate service
    var Content, httpBackend, url, AuthService,
        forceDownloadQueryParam = '\\?fd=true';

    beforeEach(inject(function (_Content_, _$httpBackend_, _url_, _AuthService_) {
        Content = _Content_;
        AuthService = _AuthService_;
        httpBackend = _$httpBackend_;
        url = _url_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the content url', function () {
        expect(!!Content).toBe(true);
        expect(Content.getContentUrlWithKey('k1')).toMatch(url.content + '/key/k1');
        expect(Content.getContentUrlWithPath('<path>', '<alias>', undefined)).toMatch(url.content + '/<alias>/head/' + encodeURIComponent('<path>'));
        expect(Content.getContentUrlWithPath('<path>', '<alias>', '<root>')).toMatch(url.content + '/<alias>/<root>/' + encodeURIComponent('<path>'));
        expect(Content.getContentUrlWithPath('<path>', '<alias>', '<root>', true)).toMatch(url.contentNoSSL + '/<alias>/<root>/' + encodeURIComponent('<path>'));
    });

    it('should return the thumb url', function () {
        var expectedUrl = url.api + '/thumbs/k1';
        expect(Content.getThumbUrlWithKey('k1')).toBe(expectedUrl);
        expectedUrl += '?size=<size>';
        expect(Content.getThumbUrlWithKey('k1', '<size>')).toBe(expectedUrl);
        expectedUrl = expectedUrl.replace(url.api, url.apiNoSSL);
        expect(Content.getThumbUrlWithKey('k1', '<size>', undefined, true)).toBe(expectedUrl);
        expectedUrl += '&min=true';
        expect(Content.getThumbUrlWithKey('k1', '<size>', true, true)).toBe(expectedUrl);
    });

    it('should return the download url', function () {
        var expectedUrl = Content.getContentUrlWithKey('k1') + forceDownloadQueryParam;
        expect(Content.getDownloadUrlWithKey('k1')).toMatch(expectedUrl);
        expectedUrl = Content.getContentUrlWithPath('<path>', '<alias>', '<root>') + forceDownloadQueryParam;
        expect(Content.getDownloadUrlWithPath('<path>', '<alias>', '<root>')).toMatch(expectedUrl);
        expectedUrl = expectedUrl.replace(url.content, url.contentNoSSL);
        expect(Content.getDownloadUrlWithPath('<path>', '<alias>', '<root>', true)).toMatch(expectedUrl);
    });

    it('should return the export url', function () {
        var expectedUrl = url.content + '/export\\?&path=/<path>&path=/<path2>';
        expect(Content.getExportUrl(['<path>', '<path2>'])).toMatch(expectedUrl);
        expectedUrl += '&filename=<filename>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>')).toMatch(expectedUrl);
        expectedUrl += '&format=<format>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>')).toMatch(expectedUrl);
        expectedUrl += '&followsymlink=<followsymlink>';
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>', '<followsymlink>')).toMatch(expectedUrl);
        expectedUrl = expectedUrl.replace(url.content, url.contentNoSSL);
        expect(Content.getExportUrl(['<path>', '<path2>'], '<filename>', '<format>', '<followsymlink>', true)).toMatch(expectedUrl);
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
