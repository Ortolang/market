'use strict';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.icons
 * @description
 * # icons
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('icons',
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
            // Visibility
            everybody: 'fa fa-fw fa-globe',
            friends: 'fa fa-fw fa-users',
            nobody: 'fa fa-fw fa-lock',
            // Browser
            browser: {
                home: 'glyphicon glyphicon-home',
                viewModeTile: 'glyphicon glyphicon-th-large',
                viewModeLine: 'glyphicon glyphicon-align-justify',
                download: 'glyphicon glyphicon-download',
                upload: 'glyphicon glyphicon-upload',
                uploadZip: 'glyphicon glyphicon-compressed',
                delete: 'glyphicon glyphicon-trash',
                remove: 'glyphicon glyphicon-remove',
                edit: 'glyphicon glyphicon-pencil',
                preview: 'glyphicon glyphicon-eye-open',
                plus: 'glyphicon glyphicon-plus',
                search: 'glyphicon glyphicon-search',
                sort: 'glyphicon glyphicon-sort',
                metadata: 'glyphicon glyphicon-list',
                info: 'glyphicon glyphicon-info-sign',
                workspaceList: 'glyphicon glyphicon-th-list',
                publish: 'glyphicon glyphicon-ok',
                snapshot: 'glyphicon glyphicon-floppy-disk',
                history: 'glyphicon glyphicon-time',
                published: 'glyphicon glyphicon-ok',
                shortcuts: 'glyphicon glyphicon-question-sign',
                tools: 'fa fa-fw fa-cube',
                settings: 'glyphicon glyphicon-cog',
                members: 'fa fa-fw fa-users',
                workspace: 'glyphicon glyphicon-book',
                browse: 'glyphicon glyphicon-th',
                dashboard: 'glyphicon glyphicon-dashboard'
            }
        });
