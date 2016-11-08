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
            folder: 'fa fa-fw fa-folder-o',
            folderPlain: 'fa fa-fw fa-folder',
            folderOpen: 'fa fa-fw fa-folder-open-o',
            folderOpenPlain: 'fa fa-fw fa-folder-open',
            link: 'fa fa-fw fa-link',
            externalLink: 'fa fa-fw fa-external-link',
            file: 'fa fa-fw fa-file-o',
            files: 'fa fa-fw fa-files-o',
            textFile: 'fa fa-fw fa-file-text-o',
            codeFile: 'fa fa-fw fa-file-code-o',
            imageFile: 'fa fa-fw fa-file-image-o',
            audioFile: 'fa fa-fw fa-file-audio-o',
            videoFile: 'fa fa-fw fa-file-video-o',
            pdfFile: 'fa fa-fw fa-file-pdf-o',
            archiveFile: 'fa fa-fw fa-file-archive-o',
            officeWordFile: 'fa fa-fw fa-file-word-o',
            officeExcelFile: 'fa fa-fw fa-file-excel-o',
            officePowerpointFile: 'fa fa-fw fa-file-powerpoint-o',
            trash: 'glyphicon glyphicon-trash',
            download: 'fa fa-fw fa-download',
            remove: 'glyphicon glyphicon-remove',
            check: 'fa fa-fw fa-check',
            square: 'fa fa-fw fa-square-o',
            plus: 'glyphicon glyphicon-plus',
            minus: 'glyphicon glyphicon-minus',
            play: 'fa fa-fw fa-play',
            tag: 'fa fa-fw fa-tag',
            cart: 'fa fa-fw fa-star',
            cartPlus: 'fa fa-star',
            edit: 'glyphicon glyphicon-pencil',
            clipboard: 'octicon octicon-clippy',
            cloudUpload: 'glyphicon glyphicon-cloud-upload',
            pending: 'fa fa-refresh fa-spin',
            search: 'glyphicon glyphicon-search',
            location: 'fa fa-fw fa-map-marker',
            share: 'glyphicon glyphicon-share-alt',
            info: 'fa fa-info-circle',
            question: 'fa fa-question-circle',
            more: 'fa fa-ellipsis-h',
            news: 'glyphicon glyphicon-bullhorn',
            statistics: 'fa fa-line-chart',
            language: 'fa fa-fw fa-globe',
            user: 'fa fa-user fa-fw',
            signOut: 'fa fa-sign-out fa-fw',
            notifications: 'fa fa-fw fa-bell',
            facebook: 'fa fa-facebook',
            twitter: 'fa fa-twitter',
            linkedin: 'fa fa-linkedin',
            viadeo: 'fa fa-viadeo',
            mail: 'fa fa-envelope',
            // Ortolang elements
            ortolang: {
                collection: 'glyphicon glyphicon-folder-close',
                link: 'glyphicon glyphicon-link',
                object: 'glyphicon glyphicon-file',
                metadata: 'glyphicon glyphicon-list-alt',
                unknown: 'glyphicon glyphicon-minus'
            },
            section: {
                corpora: 'fa fa-fw fa-book',
                lexicons: 'fa fa-fw fa-quote-right',
                applications: 'fa fa-fw fa-briefcase',
                tools: 'fa fa-fw fa-cubes',
                terminologies: 'fa fa-fw fa-font'
            },
            tree: {
                collection: 'fa fa-folder',
                collectionOpen: 'fa fa-folder-open',
                object: 'fa fa-file-o'
            },
            acl: {
                forall: 'fa fa-fw fa-globe',
                authentified: 'fa fa-fw fa-user',
                esr: 'fa fa-fw fa-graduation-cap',
                restricted: 'fa fa-fw fa-ban'
            },
            diff: {
                diff: 'fa fa-fw fa-history',
                new: 'fa fa-fw fa-plus',
                removed: 'fa fa-fw fa-minus',
                renamed: 'fa fa-fw fa-arrow-right',
                binary: 'fa fa-fw fa-file',
                metadatas: 'fa fa-fw fa-list'
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
                uploadToWorkspace: 'glyphicon glyphicon-cloud-upload',
                delete: 'glyphicon glyphicon-trash',
                move: 'fa fa-folder',
                preview: 'glyphicon glyphicon-eye-open',
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
                back: 'glyphicon glyphicon-arrow-left',
                forward: 'glyphicon glyphicon-arrow-right',
                backToDashboard: 'glyphicon glyphicon-triangle-left',
                others: 'fa fa-fw fa-ellipsis-v',
                keyboard: 'fa fa-fw fa-keyboard-o'
            },
            slideshow: {
                arrowLeft: 'fa fa-arrow-circle-left',
                arrowRight: 'fa fa-arrow-circle-right'
            },
            tasks: {
                claim: 'fa fa-fw fa-reply',
                unclaim: 'fa fa-fw fa-share',
                workspace: 'fa fa-fw fa-search'
            },
            threads: {
                notanswered: 'fa fa-fw fa-question-circle-o',
                answered: 'fa fa-fw fa-check-circle',
                reply: 'fa fa-fw fa-reply'
            }
        });
