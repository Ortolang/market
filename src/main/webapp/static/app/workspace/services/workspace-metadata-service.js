'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceMetadataService
 * @description
 * # WorkspaceMetadataService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('WorkspaceMetadataService', ['$rootScope', '$q', '$filter', 'WorkspaceElementResource', 'Workspace', 'ortolangType', 
        function ($rootScope, $q, $filter, WorkspaceElementResource, Workspace, ortolangType) {

    var WorkspaceMetadataService = this;

        this.metadataChanged = false;
        this.metadata = {};
        this.format = null;
        this.metadataErrors = {title: false, type: false, description: false};
        this.canEdit = true;

        function postForm(metadata, deferred) {

            // var deferred = $q.defer();
            var content = angular.toJson(metadata);
            var fd = new FormData(),
                currentPath = '/';

            fd.append('path', currentPath);
            fd.append('type', ortolangType.metadata);

            fd.append('name', 'ortolang-item-json');
            if (WorkspaceMetadataService.format !== null) {
                fd.append('format', WorkspaceMetadataService.format.id);
            }

            var blob = new Blob([content], { type: 'text/json'});

            fd.append('stream', blob);

            WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function () {
                Workspace.refreshActiveWorkspaceMetadata().then(function() {
                        Workspace.getActiveWorkspaceMetadata().then(function() {
                            WorkspaceMetadataService.metadataChanged = false;
                            deferred.resolve();
                        });
                    });
            }, function (errors) {
                deferred.reject(errors);
            });
            return deferred.promise;
        }

        this.save = function () {

            var deferred = $q.defer();
            var error = false;
            if (angular.isUndefined(this.metadata.type)) {
                this.metadataErrors.type = true;
                error = true;
            } else {
                this.metadataErrors.type = false;
            }

            if (angular.isUndefined(this.metadata.title)) {
                this.metadataErrors.title = true;
                error = true;
            } else {
                this.metadataErrors.title = false;
            }

            if (angular.isUndefined(this.metadata.description)) {
                this.metadataErrors.description = true;
                error = true;
            } else {
                this.metadataErrors.description = false;
            }
            if (error) {
                deferred.reject();
                $rootScope.$broadcast('workspace.metadata.errors', [1,2,3]);
                return deferred.promise;
            }

            var metadataCopy = angular.copy(this.metadata);
            delete metadataCopy.imageUrl;
            delete metadataCopy.social;

            angular.forEach(metadataCopy.contributors, function (contributor) {
                delete contributor.entityContent;
                delete contributor.rolesEntity;
                delete contributor.organizationEntity;
            });

            metadataCopy.publicationDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            return postForm(metadataCopy, deferred);
        };

        return this;
    }]);
