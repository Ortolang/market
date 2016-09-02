'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceMetadataService
 * @description
 * # WorkspaceMetadataService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('WorkspaceMetadataService', ['$rootScope', '$q', '$filter', 'WorkspaceElementResource', 'ReferentialResource', 'Workspace', 'ortolangType', 'Helper',
        function ($rootScope, $q, $filter, WorkspaceElementResource, ReferentialResource, Workspace, ortolangType, Helper) {

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

                ReferentialResource.get({name: newOrganization.id}, function(reason) {
                    //TODO notify and ask to choose one of the result or create a new one
                    console.log('organization exists');
                    deferred.reject(reason);
                }, function () {
                    var entity = angular.copy(newOrganization);
                    entity.schema = 'http://www.ortolang.fr/schema/organization/01#';
                    entity.type = 'organization';
                    var content = angular.toJson(entity);
                    ReferentialResource.post({}, {name: entity.id, type: 'ORGANIZATION', content: content}, function () {
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

            this.addLanguage = function (language, languagesId) {
                // if (!organizationExists(language, this.metadata.sponsorsEntity)) {
                if (this.metadata[languagesId] === undefined) {
                    this.metadata[languagesId] = [];
                }
                if (this.metadata[languagesId+'Entity'] === undefined) {
                    this.metadata[languagesId+'Entity'] = [];
                }
                if (language.id) {
                    // Adds language from the referential
                    this.metadata[languagesId].push(language.id);
                    // The tags-input module push the language in entity array
                } else {
                    // Adds language from scatch (not in the referential)
                    this.metadata[languagesId].push(language);
                    this.metadata[languagesId+'Entity'].push({label: Helper.getMultilingualValue(language.labels), content: language});
                }
                // } else {
                //     console.log('L\'organisme est déjà présent dans la liste des sponsors de la ressource.');
                // }
            };

            this.setLanguage = function (language, newLanguage, languagesId) {
                language.label = Helper.getMultilingualValue(newLanguage.labels);
                language.content = angular.copy(newLanguage);
                language.id = angular.copy(newLanguage.id);

                if (angular.isUndefined(language.id)) {
                    var indexLanguage = this.metadata[languagesId+'Entity'].indexOf(language);
                    this.metadata[languagesId][indexLanguage] = newLanguage;
                }
            };

            this.replaceLanguage = function (language, newLanguage, languagesId) {
                var deferred = $q.defer();
                var indexLanguage = this.metadata[languagesId+'Entity'].indexOf(language);

                ReferentialResource.get({name: newLanguage.id}, function(reason) {
                    //TODO notify and ask to choose one of the result or create a new one
                    console.log('language exists');
                    deferred.reject(reason);
                }, function () {
                    var entity = angular.copy(newLanguage);
                    entity.type = 'Language';
                    var content = angular.toJson(entity);
                    ReferentialResource.post({}, {name: entity.id, type: 'LANGUAGE', content: content}, function () {
                        // createEntity(entity.id, entity).then(function () {
                        console.log('language created');
                        WorkspaceMetadataService.metadata[languagesId][indexLanguage] = Helper.createKeyFromReferentialName(newLanguage.id);
                        WorkspaceMetadataService.setLanguage(language, newLanguage, languagesId);


                        WorkspaceMetadataService.metadataChanged = true;
                        deferred.resolve();
                    }, function (reason) {
                        console.log(reason);
                        deferred.reject(reason);
                    });
                });
                return deferred.promise;
            };

            this.addLicense = function (license) {
                if (license.id) {
                    // Adds license from the referential
                    this.metadata.license = license.id;
                    this.metadata.licenseEntity = license;
                } else {
                    // Adds license from scatch (not in the referential)
                    this.metadata.license = license;
                    this.metadata.licenseEntity = license;
                }
            };

            this.setLicense = function (license, newLicense) {
                license.id = newLicense.id;
                license.label = angular.copy(newLicense.label);
                license.description = angular.copy(newLicense.description);
                license.status = newLicense.status;
                license.text = angular.copy(newLicense.text);
            };

            this.replaceLicense = function (licence, newLicence) {
                var deferred = $q.defer();

                ReferentialResource.get({name: newLicence.id}, function(reason) {
                    //TODO notify and ask to choose one of the result or create a new one
                    console.log('licence exists');
                    deferred.reject(reason);
                }, function () {
                    var entity = angular.copy(newLicence);
                    entity.type = 'Licence';
                    entity.schema = 'http://www.ortolang.fr/schema/license/01#';
                    var content = angular.toJson(entity);
                    ReferentialResource.post({}, {name: entity.id, type: 'LICENSE', content: content}, function () {
                        console.log('licence created');
                        WorkspaceMetadataService.metadata.license = Helper.createKeyFromReferentialName(newLicence.id);
                        WorkspaceMetadataService.setLicense(licence, newLicence);

                        WorkspaceMetadataService.metadataChanged = true;
                        deferred.resolve();
                    }, function (reason) {
                        console.log(reason);
                        deferred.reject(reason);
                    });
                });
                return deferred.promise;
            };

            this.addPart = function (title, description) {
                if (!this.metadata.parts) {
                    this.metadata.parts = [];
                }
                this.metadata.parts.push({
                    title: title,
                    description: description
                });
            };

            this.updatePart = function (index, title, description) {
                if (this.metadata.parts && this.metadata.parts[index]) {
                    this.metadata.parts[index] = {
                        title: title,
                        description: description
                    };
                }
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

            this.updateProducersOrder = function () {
                this.metadata.producers = [];
                angular.forEach(this.metadata.producersEntity, function (entity) {
                    WorkspaceMetadataService.metadata.producers.push(Helper.createKeyFromReferentialName(entity.id));
                });
            };

            this.updateSponsorsOrder = function () {
                this.metadata.sponsors = [];
                angular.forEach(this.metadata.sponsorsEntity, function (entity) {
                    WorkspaceMetadataService.metadata.sponsors.push(Helper.createKeyFromReferentialName(entity.id));
                });
            };

            this.getMetadata = function () {
                var metadataCopy = angular.copy(this.metadata);
                delete metadataCopy.imageUrl;
                delete metadataCopy.social;

                delete metadataCopy.licenseEntity;
                delete metadataCopy.producersEntity;
                delete metadataCopy.sponsorsEntity;
                delete metadataCopy.corporaLanguagesEntity;
                delete metadataCopy.corporaStudyLanguagesEntity;
                delete metadataCopy.navigationLanguagesEntity;

                delete metadataCopy.toolLanguagesEntity;
                delete metadataCopy.lexiconInputLanguagesEntity;
                delete metadataCopy.lexiconDescriptionLanguagesEntity;
                delete metadataCopy.terminoInputLanguagesEntity;

                angular.forEach(metadataCopy.contributors, function (contributor) {
                    delete contributor.entityContent;
                    delete contributor.rolesEntity;
                    delete contributor.organizationEntity;
                });

                metadataCopy.publicationDate = $filter('date')(new Date(), 'yyyy-MM-dd');

                for(var key in metadataCopy) {
                    if (angular.isArray(metadataCopy[key]) && metadataCopy[key].length === 0) {
                        delete metadataCopy[key];
                    }
                }
                return metadataCopy;
            };

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

                var metadataCopy = this.getMetadata();
                return postForm(metadataCopy, deferred);
            };

            return this;
        }]);
