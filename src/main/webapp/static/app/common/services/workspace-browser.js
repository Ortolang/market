'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceBrowserService
 * @description
 * # WorkspaceBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('WorkspaceBrowserService', function () {

        this.id = 'WorkspaceBrowserService';
        this.canEdit = true;
        this.canDownload = true;
        this.canPreview = true;
        this.canChangeRoot = true;
        this.hasBreadcrumb = true;
        this.defaultViewMode = 'line';
        this.canSwitchViewMode = true;
        this.canExecuteTool = true;
        this.displayAsideInfo = true;
        this.displayAsideWorkspaceList = true;
        this.workspace = {};

        return this;
    });
