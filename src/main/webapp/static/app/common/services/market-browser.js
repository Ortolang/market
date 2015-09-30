'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MarketBrowserService
 * @description
 * # MarketBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('MarketBrowserService', function () {

        this.id = 'MarketBrowserService';
        this.canEdit = false;
        this.canDownload = true;
        this.canPreview = true;
        this.canChangeRoot = false;
        this.defaultViewMode = 'tile';
        this.canSwitchViewMode = true;
        this.canExecuteTool = false;
        this.displayAsideInfo = false;
        this.displayAsideWorkspaceList = false;
        this.workspace = {};

        return this;
    });
