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
    .filter('mimeTypeIconCss', function () {

        var xmlRegExp = new RegExp('^(?!image/)[a-zA-Z0-9\/+]*xml$');

        return function (input) {
            if (input === 'ortolang/collection') {
                return 'fa fa-folder-o';
            }
            if (/^text/.test(input)) {
                return 'fa fa-file-text-o';
            }
            if (xmlRegExp.test(input)) {
                return 'fa fa-file-code-o';
            }
            if (/^image/.test(input)) {
                return 'fa fa-file-image-o';
            }
            if (/^audio/.test(input)) {
                return 'fa fa-file-audio-o';
            }
            if (/^video/.test(input)) {
                return 'fa fa-file-video-o';
            }
            if (input === 'application/pdf') {
                return 'fa fa-file-pdf-o';
            }
            if (input === 'application/zip') {
                return 'fa fa-file-archive-o';
            }
            if (input === 'application/msword') {
                return 'fa fa-file-word-o';
            }
            if (input === 'application/vnd.ms-excel') {
                return 'fa fa-file-excel-o';
            }
            if (input === 'application/vnd.ms-powerpoint') {
                return 'fa fa-file-powerpoint-o';
            }
            if (/officedocument/.test(input)) {
                if (/wordprocessingml/.test(input)) {
                    return 'fa fa-file-word-o';
                }
                if (/spreadsheetml/.test(input)) {
                    return 'fa fa-file-excel-o';
                }
                if (/presentationml/.test(input)) {
                    return 'fa fa-file-powerpoint-o';
                }
            }
            return 'fa fa-file-o';
        };
    });
