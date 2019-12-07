'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:browserFileSelect
 * @description
 * # browserFileSelect
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('browserFileSelect', {
        bindings: {
            forceMimeTypes: '<?',
            forceWorkspace: '<',
            path: '<?forcePath',
            forceHead: '<?',
            fileSelectId: '<',
            hideElements: '<?',
            fileSelectAcceptMultiple: '<acceptMultiple'
        },
        template: '<browser options="$ctrl.options" workspaces="$ctrl.workspaces" workspace="$ctrl.workspace"></browser>',
        controller: ['$filter', 'WorkspaceResource', 'Settings', function ($filter, WorkspaceResource, Settings) {

            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.options = {
                    isFileSelect: true,
                    forceMimeTypes: this.forceMimeTypes,
                    forceWorkspace: this.forceWorkspace,
                    path: this.path,
                    forceHead: this.forceHead,
                    fileSelectId: this.fileSelectId,
                    hideElements: this.hideElements,
                    fileSelectAcceptMultiple: this.fileSelectAcceptMultiple
                };

                WorkspaceResource.get().$promise.then(function (data) {
                    ctrl.workspaces = data.entries;
                    if (ctrl.forceWorkspace || Settings.browser.fileSelect.wskey) {
                        var key = ctrl.forceWorkspace || Settings.browser.fileSelect.wskey,
                            filteredWorkspace = $filter('filter')(data.entries, { key: key }, true);
                        if (filteredWorkspace.length !== 1) {
                            WorkspaceResource.get({ wskey: key }, function (response) {
                                ctrl.workspace = response;
                            }, function () {
                                console.error('No workspace with key "%s" available', key);
                                if (!ctrl.forceWorkspace) {
                                    ctrl.workspace = data.entries[0];
                                }
                            });
                            return;
                        }
                        ctrl.workspace = filteredWorkspace[0];
                    } else {
                        ctrl.workspace = data.entries[0];
                    }
                });
            };
        }]
    });
