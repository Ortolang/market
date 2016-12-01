'use strict';

describe('Filter: mimeTypeIconCss', function () {

    // load the filter's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // initialize a new instance of the filter before each test
    var mimeTypeIconCss,
        icons;
    beforeEach(inject(function ($filter, _icons_) {
        mimeTypeIconCss = $filter('mimeTypeIconCss');
        icons = _icons_;
    }));

    it('should return undefined when there is no input', function () {
        expect(mimeTypeIconCss(undefined)).toBe(undefined);
    });

    it('should return default file icon when unknown mime type', function () {
        expect(mimeTypeIconCss('foo')).toBe(icons.file);
    });

    it('should return folder icon for mime type "ortolang/collection"', function () {
        expect(mimeTypeIconCss('ortolang/collection')).toBe(icons.folder);
    });

    it('should return link icon for mime type "ortolang/link"', function () {
        expect(mimeTypeIconCss('ortolang/link')).toBe(icons.link);
    });

    it('should return code icon for xml files', function () {
        expect(mimeTypeIconCss('text/xml')).toBe(icons.codeFile);
        expect(mimeTypeIconCss('application/rdf+xml')).toBe(icons.codeFile);
        expect(mimeTypeIconCss('image/svg+xml')).not.toBe(icons.codeFile);
        expect(mimeTypeIconCss('image/svg+xml')).toBe(icons.imageFile);
    });

    it('should return code file icon for code files', function () {
        expect(mimeTypeIconCss('text/html')).toBe(icons.codeFile);
        expect(mimeTypeIconCss('application/javascript')).toBe(icons.codeFile);
        expect(mimeTypeIconCss('application/json')).toBe(icons.codeFile);
    });

    it('should return text file icon for files with mime types starting with "text/" that are not code files', function () {
        expect(mimeTypeIconCss('text/plain')).toBe(icons.textFile);
        expect(mimeTypeIconCss('text/rtf')).toBe(icons.textFile);
        expect(mimeTypeIconCss('text/richtext')).toBe(icons.textFile);
    });

    it('should return image file icon for mime types starting with "image/"', function () {
        expect(mimeTypeIconCss('image/tiff')).toBe(icons.imageFile);
        expect(mimeTypeIconCss('image/jpg')).toBe(icons.imageFile);
        expect(mimeTypeIconCss('image/jpeg')).toBe(icons.imageFile);
        expect(mimeTypeIconCss('image/gif')).toBe(icons.imageFile);
        expect(mimeTypeIconCss('image/png')).toBe(icons.imageFile);
    });

    it('should return audio file icon for mime types starting with "audio/"', function () {
        expect(mimeTypeIconCss('audio/ogg')).toBe(icons.audioFile);
        expect(mimeTypeIconCss('audio/mpeg')).toBe(icons.audioFile);
    });

    it('should return video file icon for mime types starting with "video/"', function () {
        expect(mimeTypeIconCss('video/ogg')).toBe(icons.videoFile);
        expect(mimeTypeIconCss('video/mpeg')).toBe(icons.videoFile);
        expect(mimeTypeIconCss('video/mp4')).toBe(icons.videoFile);
        expect(mimeTypeIconCss('video/x-msvideo')).toBe(icons.videoFile);
        expect(mimeTypeIconCss('video/quicktime')).toBe(icons.videoFile);
    });

    it('should return pdf file icon for pdf files', function () {
        expect(mimeTypeIconCss('application/pdf')).toBe(icons.pdfFile);
    });

    it('should return archive file icon for archive files', function () {
        expect(mimeTypeIconCss('application/zip')).toBe(icons.archiveFile);
        expect(mimeTypeIconCss('application/x-rar-compressed')).toBe(icons.archiveFile);
        expect(mimeTypeIconCss('application/x-tar')).toBe(icons.archiveFile);
        expect(mimeTypeIconCss('application/x-apple-diskimage')).toBe(icons.archiveFile);
    });

    it('should return office file icon for microsoft office files', function () {
        expect(mimeTypeIconCss('application/msword')).toBe(icons.officeWordFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe(icons.officeWordFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.wordprocessingml.template')).toBe(icons.officeWordFile);

        expect(mimeTypeIconCss('application/vnd.ms-excel')).toBe(icons.officeExcelFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBe(icons.officeExcelFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.spreadsheetml.template')).toBe(icons.officeExcelFile);

        expect(mimeTypeIconCss('application/vnd.ms-powerpoint')).toBe(icons.officePowerpointFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.presentationml.presentation')).toBe(icons.officePowerpointFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.presentationml.template')).toBe(icons.officePowerpointFile);
        expect(mimeTypeIconCss('application/vnd.openxmlformats-officedocument.presentationml.slideshow')).toBe(icons.officePowerpointFile);
    });
});
