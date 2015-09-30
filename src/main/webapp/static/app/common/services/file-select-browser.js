'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FileSelectBrowserService
 * @description
 * # FileSelectBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('FileSelectBrowserService', function () {

        this.id = 'FileSelectBrowserService';
        this.canEdit = false;
        this.canDownload = false;
        this.canPreview = false;
        this.canChangeRoot = true;
        this.hasBreadcrumb = true;
        this.defaultViewMode = 'line';
        this.canSwitchViewMode = false;
        this.canExecuteTool = false;
        this.displayAsideInfo = false;
        this.displayAsideWorkspaceList = true;
        this.workspace = {};

        return this;
    });
