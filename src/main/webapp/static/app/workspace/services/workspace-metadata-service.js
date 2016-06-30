'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceMetadataService
 * @description
 * # WorkspaceMetadataService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('WorkspaceMetadataService', ['$rootScope', '$q', '$filter', 'WorkspaceElementResource', 'ReferentialEntityResource', 'Workspace', 'ortolangType', 'Helper', 
        function ($rootScope, $q, $filter, WorkspaceElementResource, ReferentialEntityResource, Workspace, ortolangType, Helper) {

    var WorkspaceMetadataService = this;

        this.metadataChanged = false;
        this.metadata = {};
        this.format = null;
        this.metadataErrors = {title: false, type: false, description: false};
        this.canEdit = true;

        function organizationExists(organization, organizations) {
            if (angular.isDefined(organization) && angular.isDefined(organizations)) {
                //TODO with $filter (slower?)
                var indexOrganization;
                for (indexOrganization = 0; indexOrganization < organizations.length; indexOrganization++) {
                    if (angular.isDefined(organizations[indexOrganization].id) && angular.isDefined(organization.id)) {
                        if (organizations[indexOrganization].id === organization.id) {
                            return true;
                        }
                    } else if (organizations[indexOrganization].name && organization.name){
                        if (organizations[indexOrganization].name === organization.name) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function replaceOrganization (organization, newOrganization, organizations, organizationsEntity) {
            var deferred = $q.defer();
            var indexSponsor = organizationsEntity.indexOf(organization);

            ReferentialEntityResource.get({name: newOrganization.id}, function(reason) {
                //TODO notify and ask to choose one of the result or create a new one
                console.log('organization exists');
                deferred.reject(reason);
            }, function () {
                var entity = angular.copy(newOrganization);
                entity.schema = 'http://www.ortolang.fr/schema/organization/01#';
                entity.type = 'organization';
                var content = angular.toJson(entity);
                ReferentialEntityResource.post({}, {name: entity.id, type: 'ORGANIZATION', content: content}, function () {
                // createEntity(entity.id, entity).then(function () {
                    console.log('organization created');
                    organizations[indexSponsor] = Helper.createKeyFromReferentialName(newOrganization.id);
                    WorkspaceMetadataService.setOrganization(organization, newOrganization);

                    WorkspaceMetadataService.metadataChanged = true;
                    deferred.resolve();
                }, function (reason) {
                    console.log(reason);
                    deferred.reject(reason);
                });    
            });
            return deferred.promise;
        }

        this.addProducer = function (producer) {
            if (!organizationExists(producer, this.metadata.producersEntity)) {
                if (this.metadata.producers === undefined) {
                    this.metadata.producers = [];
                }
                if (this.metadata.producersEntity === undefined) {
                    this.metadata.producersEntity = [];
                }
                if (producer.id) {
                    // Adds producer from the referential
                    this.metadata.producers.push(Helper.createKeyFromReferentialName(producer.id));
                    this.metadata.producersEntity.push(producer);
                } else {
                    // Adds producer from scatch (not in the referential)
                    this.metadata.producers.push(producer);
                    this.metadata.producersEntity.push(producer);
                }
            } else {
                console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
            }
        };

        this.replaceProducer = function (producer, newProducer) {
            return replaceOrganization(producer, newProducer, this.metadata.producers, this.metadata.producersEntity);
        };

        this.addSponsor = function (sponsor) {
            if (!organizationExists(sponsor, this.metadata.sponsorsEntity)) {
                if (this.metadata.sponsors === undefined) {
                    this.metadata.sponsors = [];
                }
                if (this.metadata.sponsorsEntity === undefined) {
                    this.metadata.sponsorsEntity = [];
                }
                if (sponsor.id) {
                    // Adds sponsor from the referential
                    this.metadata.sponsors.push(Helper.createKeyFromReferentialName(sponsor.id));
                    this.metadata.sponsorsEntity.push(sponsor);
                } else {
                    // Adds sponsor from scatch (not in the referential)
                    this.metadata.sponsors.push(sponsor);
                    this.metadata.sponsorsEntity.push(sponsor);
                }
            } else {
                console.log('L\'organisme est déjà présent dans la liste des sponsors de la ressource.');
            }
        };

        this.replaceSponsor = function (sponsor, newSponsor) {
            return replaceOrganization(sponsor, newSponsor, this.metadata.sponsors, this.metadata.sponsorsEntity);
        };

        this.setOrganization = function (producer, newProducer) {
            producer.id = newProducer.id;
            producer.name = newProducer.name;
            producer.acronym = newProducer.acronym;
            producer.fullname = newProducer.fullname;
            producer.city = newProducer.city;
            producer.country = newProducer.country;
            producer.homepage = newProducer.homepage;
            producer.img = newProducer.img;
        };

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

            delete metadataCopy.producersEntity;
            delete metadataCopy.sponsorsEntity;

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
