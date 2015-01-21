'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.icons
 * @description
 * # icons
 * Value in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .value('icons',
        {
            // Files & folder
            folder: 'fa fa-folder-o',
            folderPlain: 'fa fa-folder',
            file: 'fa fa-file-o',
            files: 'fa fa-files-o',
            textFile: 'fa fa-file-text-o',
            codeFile: 'fa fa-file-code-o',
            imageFile: 'fa fa-file-image-o',
            audioFile: 'fa fa-file-audio-o',
            videoFile: 'fa fa-file-video-o',
            pdfFile: 'fa fa-file-pdf-o',
            archiveFile: 'fa fa-file-archive-o',
            officeWordFile: 'fa fa-file-word-o',
            officeExcelFile: 'fa fa-file-excel-o',
            officePowerpointFile: 'fa fa-file-powerpoint-o',
            trash: 'glyphicon glyphicon-trash',
            // Ortolang elements
            ortolang: {
                collection: 'glyphicon glyphicon-folder-close',
                object: 'glyphicon glyphicon-file',
                metadata: 'glyphicon glyphicon-list-alt',
                unknown: 'glyphicon glyphicon-minus'
            },
            // Browser
            browser: {
                home: 'glyphicon glyphicon-home',
                viewModeTile: 'glyphicon glyphicon-th-large',
                viewModeLine: 'glyphicon glyphicon-align-justify',
                download: 'glyphicon glyphicon-download',
                upload: 'glyphicon glyphicon-upload',
                delete: 'glyphicon glyphicon-trash',
                remove: 'glyphicon glyphicon-remove',
                preview: 'glyphicon glyphicon-eye-open',
                plus: 'glyphicon glyphicon-plus',
                search: 'glyphicon glyphicon-search',
                sort: 'glyphicon glyphicon-sort',
                metadata: 'glyphicon glyphicon-list',
                info: 'glyphicon glyphicon-info-sign',
                publish: 'glyphicon glyphicon-ok',
                snapshot: 'glyphicon glyphicon-floppy-disk',
                history: 'glyphicon glyphicon-time',
                draft: 'octicon octicon-beer',
                published: 'glyphicon glyphicon-globe',
                tools: 'fa fa-puzzle-piece'
            }
        });
