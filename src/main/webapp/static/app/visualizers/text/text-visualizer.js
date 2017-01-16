'use strict';

/**
 * @ngdoc controller
 * @name ortolangVisualizers.controller:TextVisualizerCtrl
 * @description
 * # TextVisualizerCtrl
 */
angular.module('ortolangVisualizers')
    .controller('TextVisualizerCtrl', ['$scope', 'Content', function ($scope, Content) {

        function isHtml(mimeType) {
            return mimeType === 'text/html' || mimeType === 'application/xhtml+xml';
        }

        var mimeType = $scope.$ctrl.data.element.mimeType,
            name = $scope.$ctrl.data.element.name,
            limit = 20000;
        $scope.hasPreview = false;
        if (mimeType === 'application/xml' || mimeType === 'application/rdf+xml' || mimeType === 'text/xml' || mimeType === 'application/xslt+xml' || mimeType === 'application/xml-dtd') {
            $scope.language = 'xml';
        } else if (mimeType === 'text/plain' && name.endsWith('.ts')) {
            $scope.language = 'typescript';
        } else if (isHtml(mimeType) || mimeType === 'text/plain' || mimeType === 'text/csv') {
            $scope.language = 'html';
        } else if (mimeType === 'text/css') {
            $scope.language = 'css';
        } else if (mimeType === 'text/x-php') {
            $scope.language = 'php';
        } else if (mimeType === 'application/javascript' || mimeType === 'text/javascript') {
            $scope.language = 'javascript';
        } else if (mimeType === 'application/json') {
            $scope.language = 'json';
        } else if (mimeType === 'text/x-web-markdown') {
            $scope.language = 'markdown';
        } else if (mimeType === 'text/x-java-source') {
            $scope.language = 'java';
        } else if (mimeType === 'application/x-sh') {
            $scope.language = 'bash';
        } else if (mimeType === 'text/x-less') {
            $scope.language = 'less';
        } else if (mimeType === 'application/postscript' && name.endsWith('.tex')) {
            $scope.language = 'tex';
        } else if (mimeType === 'text/x-sql') {
            $scope.language = 'sql';
        } else if (mimeType === 'text/x-python') {
            $scope.language = 'python';
        } else if (mimeType === 'text/x-perl') {
            $scope.language = 'perl';
        } else {
            $scope.language = undefined;
        }

        $scope.$ctrl.pendingData = true;
        $scope.truncated = $scope.$ctrl.forceFullContent ? false : $scope.$ctrl.data.element.size >= limit;
        $scope.$ctrl.footer = {
            show: function () {
                return (!$scope.hasPreview && $scope.truncated) || ($scope.hasPreview && $scope.tabs.activeTab === 'source' && $scope.truncated);
            },
            text: 'TEXT_VISUALIZER.EXCERPT'
        };
        $scope.$ctrl.footer.actions = [
            {
                name: 'seeMore',
                text: 'TEXT_VISUALIZER.SEE_MORE'
            }
        ];

        function initializeVisualizerWithPreview() {
            $scope.hasPreview = true;
            $scope.tabs = {};
            if ($scope.xsl || isHtml(mimeType)) {
                $scope.tabs.activeTab = 'preview';
            } else if ($scope.tei) {
                $scope.tabs.activeTab = 'tei';
            } else {
                $scope.tabs.activeTab = 'source';
            }
            $scope.$ctrl.header.actions = [
                {
                    name: 'showSource',
                    hide: function () {
                        return $scope.tabs.activeTab === 'source';
                    },
                    text: 'TEXT_VISUALIZER.SHOW_SOURCE'
                }
            ];
            if ($scope.xsl || isHtml(mimeType)) {
                $scope.$ctrl.header.actions.push({
                    name: 'showPreview',
                    hide: function () {
                        return $scope.tabs.activeTab === 'preview';
                    },
                    text: 'TEXT_VISUALIZER.SHOW_PREVIEW'
                });
            }
            if ($scope.tei) {
                $scope.$ctrl.header.actions.push({
                    name: 'showTei',
                    hide: function () {
                        return $scope.tabs.activeTab === 'tei';
                    },
                    text: 'TEXT_VISUALIZER.SHOW_TEI_PREVIEW'
                });
            }
            $scope.$ctrl.actions.showSource = function () {
                $scope.tabs.activeTab = 'source';
            };
            $scope.$ctrl.actions.showPreview = function () {
                $scope.tabs.activeTab = 'preview';
            };
            $scope.$ctrl.actions.showTei = function () {
                $scope.tabs.activeTab = 'tei';
            };
            if ($scope.$ctrl.data.parent && $scope.$ctrl.data.parent.path) {
                $scope.base = Content.getContentUrlWithPath($scope.$ctrl.data.parent.path, $scope.$ctrl.data.alias, $scope.$ctrl.data.root);
            }
            if ($scope.$ctrl.data.element.path) {
                $scope.pageSrc = Content.getContentUrlWithPath($scope.$ctrl.data.element.path, $scope.$ctrl.data.alias, $scope.$ctrl.data.root);
            } else if ($scope.$ctrl.data.element.downloadUrl) {
                $scope.pageSrc = $scope.$ctrl.data.element.downloadUrl;
            } else {
                $scope.pageSrc = Content.getContentUrlWithKey($scope.$ctrl.data.element.key, false);
            }
        }

        if (isHtml(mimeType)) {
            initializeVisualizerWithPreview();
            $scope.forceDisplay = true;
        } else if (mimeType !== 'application/xml') {
            $scope.forceDisplay = true;
        }
        var contentDownload;
        if ($scope.$ctrl.data.element.attachment) {
            contentDownload = Content.downloadAttachmentWithUrl($scope.$ctrl.data.element.downloadUrl);
        } else {
            contentDownload = Content.downloadWithKey($scope.$ctrl.data.element.key);
        }
        $scope.$ctrl.requests.push(contentDownload);
        contentDownload.promise.then(function (response) {
            if (!$scope.forceFullContent && $scope.$ctrl.data.element.size >= limit) {
                $scope.content = response.data.substr(0, limit);
                $scope.$ctrl.actions.seeMore = function () {
                    if ($scope.content.length + limit < $scope.fullContent.length) {
                        $scope.content = $scope.fullContent.substr(0, $scope.content.length + limit);
                    } else {
                        $scope.content = $scope.fullContent;
                        $scope.fullContent = undefined;
                        $scope.truncated = false;
                    }
                };
                $scope.fullContent = response.data;
            } else {
                $scope.content = response.data;
            }
            if (mimeType === 'application/xml') {
                if (response.data.indexOf('<?xml-stylesheet') !== -1) {
                    $scope.xsl = true;
                }
                if (response.data.indexOf('xmlns="http://www.tei-c.org/ns/1.0"') !== -1) {
                    $scope.tei = true;
                }
                if ($scope.xsl || $scope.tei) {
                    initializeVisualizerWithPreview();
                }
            }
            if (isHtml(mimeType) && response.data.indexOf('<iframe') === 0 && response.data.indexOf('</iframe>') === response.data.length - '</iframe>'.length) {
                $scope.inception = true;
            }
            $scope.$ctrl.pendingData = false;
        });
    }])
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'text',
            templateUrl: 'visualizers/text/text-visualizer.html',
            data: ['element', 'root', 'alias', 'parent'],
            name: {
                fr: 'Visualiseur de texte',
                en: 'Text Visualizer'
            },
            compatibleTypes: {
                'text/plain': true,
                'text/html': true,
                'text/x-php': true,
                'text/css': true,
                'text/x-less': true,
                'text/xml': true,
                'text/x-log': true,
                'text/troff': true,
                'application/xml': true,
                'application/xhtml+xml': true,
                'application/rdf+xml': true,
                'application/xslt+xml': true,
                'application/xml-dtd': true,
                'text/javascript': true,
                'application/javascript': true,
                'application/json': true,
                'application/x-bibtex-text-file': true,
                'text/csv': true,
                'application/octet-stream': {cha: true},
                'application/clan': true,
                'text/x-java-source': true,
                'application/x-sh': true,
                'application/postscript': {tex: true},
                'text/x-sql': true,
                'text/x-python': true,
                'text/x-perl': true
            }
        });
    }]);

