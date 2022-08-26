'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:mimeTypeIconCss
 * @function
 * @description
 * # mimeTypeIconCss
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('mimeTypeIconCss', ['icons', function (icons) {

        var xmlRegExp = new RegExp('^(?!image/)[a-zA-Z0-9\/+]*xml$'),
            codeMimeTypes = [
                'text/html',
                'text/x-php',
                'text/css',
                'text/x-less',
                'text/x-log',
                'application/javascript',
                'text/javascript',
                'application/json',
                'application/x-sh',
                'text/x-java-source',
                'text/x-sql',
                'text/x-python',
                'text/x-perl'
            ];

        return function (input) {
            if (input === undefined) {
                return undefined;
            }
            if (input === 'ortolang/collection') {
                return icons.folder;
            }
            if (input === 'ortolang/link') {
                return icons.link;
            }
            if (xmlRegExp.test(input) || codeMimeTypes.indexOf(input) >= 0) {
                return icons.codeFile;
            }
            if (/^text/.test(input)) {
                return icons.textFile;
            }
            if (/^image/.test(input)) {
                return icons.imageFile;
            }
            if (/^audio/.test(input)) {
                return icons.audioFile;
            }
            if (/^video/.test(input)) {
                return icons.videoFile;
            }
            if (input === 'application/pdf' || input === 'application/postscript') {
                return icons.pdfFile;
            }
            if (input === 'application/zip' ||
                    input === 'application/x-rar-compressed' ||
                    input === 'application/x-tar' ||
                    input === 'application/x-apple-diskimage' ||
                    input === 'application/x-7z-compressed') {
                return icons.archiveFile;
            }
            if (input === 'application/msword') {
                return icons.officeWordFile;
            }
            if (input === 'application/vnd.ms-excel') {
                return icons.officeExcelFile;
            }
            if (input === 'application/vnd.ms-powerpoint') {
                return icons.officePowerpointFile;
            }
            if (/officedocument/.test(input)) {
                if (/wordprocessingml/.test(input)) {
                    return icons.officeWordFile;
                }
                if (/spreadsheetml/.test(input)) {
                    return icons.officeExcelFile;
                }
                if (/presentationml/.test(input)) {
                    return icons.officePowerpointFile;
                }
            }
            return icons.file;
        };
    }]);
