'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Helper
 * @description
 * # Helper
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Helper', ['$rootScope', '$translate', '$alert', '$modal', '$aside', '$window', '$q', 'ProfileResource', 'ReferentialResource', 'ortolangType',
        function ($rootScope, $translate, $alert, $modal, $aside, $window, $q, ProfileResource, ReferentialResource, ortolangType) {

            var modalScope, modal, asideMobileNav, Helper = this;

            this.profileCards = {};

            this.getCard = function (username) {
                if (username) {
                    if (this.profileCards[username] === undefined) {
                        this.profileCards[username] = null;
                        return ProfileResource.getCard({key: username}, function (data) {
                            Helper.profileCards[username] = data;
                        }).$promise;
                    } else {
                        var deferred = $q.defer();
                        deferred.resolve(Helper.profileCards[username]);
                        return deferred.promise;
                    }
                }
            };

            this.prefix = {
                workspace: 'ortolang-workspace-json.',
                metaLatestSnapshot: 'ortolang-workspace-json.latestSnapshot.',
                metaItem: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.',
                metaWorkspace: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.',
                metaRating: 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.'
            };

            this.getFieldsParam = function (fields) {
                var param = [];
                angular.forEach(fields, function (value, key) {
                    angular.forEach(value.split(','), function (property) {
                        param.push(Helper.prefix[key] + property);
                    });
                });
                return param.toString();
            };

            this.getMultilingualValue = function (multilingualProperty, language) {
                if (multilingualProperty) {
                    var i;
                    language = language || $translate.use();
                    for (i = 0; i < multilingualProperty.length; i++) {
                        if (multilingualProperty[i].lang === language) {
                            return multilingualProperty[i].value;
                        }
                    }
                    return multilingualProperty.length > 0 ? multilingualProperty[0].value : undefined;
                }
            };

            this.findObjectOfArray = function (arr, propertyName, propertyValue, defaultValue) {
                if (arr) {
                    var iObject;
                    for (iObject = 0; iObject < arr.length; iObject++) {
                        if (arr[iObject][propertyName] === propertyValue) {
                            return arr[iObject];
                        }
                    }
                }
                if (defaultValue) {
                    return defaultValue;
                }
                return null;
            };


            this.loadContributors = function (contributors, authors) {
                var loadedContributors = [];

                if (contributors) {
                    angular.forEach(contributors, function (contributor) {
                        var loadedContributor = {};
                        if (Helper.startsWith(contributor.entity, '$')) {
                            // From Workspace preview with contributor inside the referential
                            ReferentialResource.get({name: Helper.extractNameFromReferentialId(contributor.entity)}, function (entity) {
                                loadedContributor.entity = angular.fromJson(entity.content);
                                // Load contributor card when previewing (?? $scope.preview && )
                                if (Helper.startsWith(loadedContributor.entity.username, '$')) {
                                    var username = Helper.extractKeyFromReferentialId(loadedContributor.entity.username);
                                    var cardPromise = Helper.getCard(username);
                                    if (cardPromise) {
                                        cardPromise.then(function (data) {
                                            loadedContributor.entity.username = {'meta_profile': data};
                                        });
                                    }
                                }
                            });

                            if (contributor.roles && contributor.roles.length > 0) {
                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function (role) {
                                    ReferentialResource.get({name: Helper.extractNameFromReferentialId(role)}, function (entity) {
                                        var contentRole = angular.fromJson(entity.content);
                                        loadedContributor.roles.push(Helper.getMultilingualValue(contentRole.labels));

                                        if (authors && contentRole.id === 'author') {
                                            authors.push(loadedContributor);
                                        }
                                    });
                                });
                            }

                            if (contributor.organization) {
                                ReferentialResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function (entity) {
                                    loadedContributor.organization = angular.fromJson(entity.content);
                                });
                            }

                            loadedContributors.push(loadedContributor);
                        } else {
                            // From Workspace (Contributor that needs to be checked) and Market with contributor outside the referential
                            loadedContributor.entity = contributor.entity;

                            if (contributor.organization) {
                                if (Helper.startsWith(contributor.organization, '$')) {
                                    ReferentialResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function (entity) {
                                        loadedContributor.organization = angular.fromJson(entity.content);
                                    });
                                } else {
                                    loadedContributor.organization = contributor.organization;
                                }
                            }

                            if (contributor.roles && contributor.roles.length > 0) {

                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function (role) {
                                    if (Helper.startsWith(role, '$')) {
                                        ReferentialResource.get({name: Helper.extractNameFromReferentialId(role)}, function (entity) {
                                            var contentRole = angular.fromJson(entity.content);
                                            loadedContributor.roles.push(Helper.getMultilingualValue(contentRole.labels));

                                            if (authors && contentRole.id === 'author') {
                                                authors.push(loadedContributor);
                                            }
                                        });
                                    } else {
                                        loadedContributor.roles.push(Helper.getMultilingualValue(role.labels));

                                        if (authors && role.id === 'author') {
                                            authors.push(loadedContributor);
                                        }
                                    }
                                });
                            }
                            loadedContributors.push(loadedContributor);
                        }
                    });
                }
                return loadedContributors;
            };


            this.loadFieldValuesInAdditionalInformations = function(content, additionalInformations, fieldKey, fieldName, lang) {
                if (angular.isDefined(content[fieldKey])) {
                    var fieldValues = [];

                    // Array
                    if (angular.isArray(content[fieldKey]) && content[fieldKey].length>0) {
                        angular.forEach(content[fieldKey], function (fieldValue) {
                            var value = {label:''};
                            if (angular.isDefined(fieldValue.labels)) {
                                // For market
                                value.label = Helper.getMultilingualValue(fieldValue.labels, lang);
                            } else if (Helper.startsWith(fieldValue, '$')) {
                                // For workspace
                                ReferentialResource.get({name: Helper.extractNameFromReferentialId(fieldValue)}, function (entity) {
                                    var content = angular.fromJson(entity.content);
                                    // fieldValues.push(Helper.getMultilingualValue(content.labels, lang));
                                    value.label = Helper.getMultilingualValue(content.labels, lang);
                                });
                            } else if (angular.isDefined(fieldValue.labels)) {
                                // fieldValues.push(Helper.getMultilingualValue(fieldValue.labels, lang));
                                value.label = Helper.getMultilingualValue(fieldValue.labels, lang);
                            } else {
                                // Not checked
                                // fieldValues.push(fieldValue);
                                value.label = fieldValue;
                            }
                            fieldValues.push(value);
                        });
                        additionalInformations.push({key: fieldKey, value: fieldValues, name: fieldName});

                        // String
                    } else if (angular.isString(content[fieldKey])) {
                        if (Helper.startsWith(content[fieldKey], '$')) {
                            // For workspace
                            ReferentialResource.get({name: Helper.extractNameFromReferentialId(content[fieldKey])}, function (entity) {
                                var content = angular.fromJson(entity.content);
                                additionalInformations.push({
                                    key: fieldKey,
                                    value: Helper.getMultilingualValue(content.labels, lang),
                                    name: fieldName
                                });
                            });
                        } else {
                            // Not checked
                            additionalInformations.push({
                                key: fieldKey,
                                value: content[fieldKey],
                                name: fieldName
                            });
                        }
                    } else if (angular.isObject(content[fieldKey])) {
                        if (angular.isDefined(content[fieldKey].labels)) {
                            // For market
                            additionalInformations.push({
                                key: fieldKey,
                                value: Helper.getMultilingualValue(content[fieldKey].labels, lang),
                                name: fieldName
                            });
                        }
                    } else {
                        // Boolean
                        additionalInformations.push({
                            key: fieldKey,
                            value: content[fieldKey],
                            name: fieldName
                        });
                    }
                }
            };


            this.loadCommonAdditionalInformations = function(content, lang) {
                var additionalInformations = [];

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'statusOfUse', 'MARKET.FACET.STATUS_OF_USE', lang);

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaType', 'MARKET.FACET.CORPORA_TYPE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaLanguageType', 'MARKET.FACET.CORPORA_LANGUAGE_TYPE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaLanguages', 'MARKET.FACET.CORPORA_LANG', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaStudyLanguages', 'MARKET.FACET.CORPORA_STUDY_LANG', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaStyles', 'MARKET.FACET.CORPORA_STYLES', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'annotationLevels', 'MARKET.FACET.ANNOTATION_LEVEL', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaFormats', 'MARKET.FACET.TEXT_FORMAT', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaFileEncodings', 'MARKET.FACET.TEXT_ENCODING', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'corporaDataTypes', 'MARKET.FACET.CORPORA_DATATYPES', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'wordCount', 'WORKSPACE.METADATA_EDITOR.WORD_COUNT');

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconInputType', 'MARKET.FACET.LEXICON_INPUT_TYPE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconLanguageType', 'MARKET.FACET.LEXICON_LANGUAGE_TYPE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconInputLanguages', 'MARKET.FACET.LEXICON_INPUT_LANGUAGE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconInputCount', 'WORKSPACE.METADATA_EDITOR.LEXICON_INPUT_COUNT');
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconDescriptionTypes', 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconDescriptionLanguages', 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'lexiconFormats', 'MARKET.FACET.LEXICON_FORMAT', lang);

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'operatingSystems', 'WORKSPACE.METADATA_EDITOR.OPERATING_SYSTEMS', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'programmingLanguages', 'MARKET.PROGRAMMING_LANGUAGE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolFunctionalities', 'MARKET.FACET.TOOL_FUNCTIONALITY', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolInputData', 'MARKET.FACET.TOOL_INPUTDATA', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolOutputData', 'MARKET.FACET.TOOL_OUTPUTDATA', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolFileEncodings', 'MARKET.FACET.TOOL_FILE_ENCODINGS', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolLanguages', 'MARKET.FACET.TOOL_LANGUAGE', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'navigationLanguages', 'WORKSPACE.METADATA_EDITOR.NAVIGATION_LANGUAGES', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'toolSupport', 'WORKSPACE.METADATA_EDITOR.TOOL_SUPPORT', lang);

                if (angular.isDefined(content.creationLocations)) {
                    var creationLocoationValue = '';
                    angular.forEach(content.creationLocations, function (creationLocation) {
                        if (creationLocation.name) {
                            creationLocoationValue += (creationLocoationValue===''?'':', ') + creationLocation.name;
                        }
                    });
                    additionalInformations.push({
                        key: 'creationLocations',
                        value: creationLocoationValue,
                        name: 'ITEM.CREATION_LOCATIONS.LABEL'
                    });
                }

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'originDate', 'ITEM.ORIGIN_DATE.LABEL', lang);

                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'linguisticDataType', 'ITEM.LINGUISTIC_DATA_TYPE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'discourseTypes', 'ITEM.DISCOURSE_TYPE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations(content, additionalInformations, 'linguisticSubjects', 'ITEM.LINGUISTIC_SUBJECT.LABEL', lang);

                return additionalInformations;
            };

            this.extractKeyFromReferentialId = function (key) {
                // Pattern : ${key}
                var exec = /^\$\{(.*)}/.exec(key);
                return exec ? exec[1] : exec;
            };

            this.createIdFromReferentialName = function (name) {
                // Pattern : referential:{name}
                return 'referential:' + name;
            };

            this.createKeyFromReferentialId = function (id) {
                // Pattern : ${key}
                return '${' + id + '}';
            };

            this.createKeyFromReferentialName = function (name) {
                // Pattern : ${key}
                return '${referential:' + name + '}';
            };

            this.extractNameFromReferentialId = function (id) {
                // Pattern : ${referential:name}
                var exec = /^\$\{referential:(.*)}/.exec(id);
                return exec ? exec[1] : exec;
            };

            this.startsWith = function (actual, expected) {
                if (!angular.isString(actual)) {
                    return false;
                }
                var lowerStr = (actual + '').toLowerCase();
                return lowerStr.indexOf(expected.toLowerCase()) === 0;
            };

            this.endsWith = function (str, suffix) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            };

            this.normalizePath = function (path) {
                return path.replace(/\/\//g, '/');
            };

            $rootScope.$on('modal.show', function (event, _modal_) {
                modal = _modal_;
            });

            this.createModalScope = function (isolate, autofocus) {
                modalScope = $rootScope.$new(isolate);
                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                    modal = undefined;
                });
                if (autofocus) {
                    modalScope.$on('modal.show', function () {
                        angular.element('.modal').find('[autofocus]:first').focus();
                    });
                }
                modalScope.models = {};
                return modalScope;
            };

            this.isModalOpened = function (id) {
                if (id) {
                    return angular.isDefined(modal) && modal.$options.id === id;
                }
                return angular.isDefined(modal);
            };

            this.hideModal = function () {
                if (modal && modal.hide) {
                    modal.hide();
                }
            };

            this.showUnexpectedErrorAlert = function (container, placement, type) {
                var config = {
                    placement: placement || 'top-right',
                    title: $translate.instant('UNEXPECTED_ERROR_ALERT.TITLE'),
                    content: $translate.instant('UNEXPECTED_ERROR_ALERT.CONTENT'),
                    type: type || 'danger'
                };
                if (container) {
                    config.container = container;
                }
                $alert(config);
            };

            this.showNotificationMessage = function (message, container, placement) {
                var config = {
                    id: 'notification',
                    title: message.title,
                    content: message.body,
                    show: true,
                    templateUrl: 'common/templates/notification-modal.html',
                };
                if (container) {
                    config.container = container;
                }
                if (placement) {
                    config.placement = placement;
                }
                $modal(config);
            };

            this.showErrorModal = function (error, container, placement) {
                if (this.isModalOpened('error')) {
                    var scope = this.createModalScope(true);
                    scope.error = error;
                    var config = {
                        id: 'error',
                        title: 'ERROR_MODAL_' + error.code + '.TITLE',
                        content: 'ERROR_MODAL_' + error.code + '.BODY',
                        show: true,
                        templateUrl: 'common/templates/error-modal.html',
                        scope: scope
                    };
                    if (container) {
                        config.container = container;
                    }
                    if (placement) {
                        config.placement = placement;
                    }
                    $modal(config);
                    return scope;
                }
            };

            this.hideAsideMobileNav = function () {
                if (asideMobileNav) {
                    asideMobileNav.hide();
                }
            };

            this.showAsideMobileNav = function () {
                if (asideMobileNav) {
                    asideMobileNav.show();
                } else {
                    asideMobileNav = $aside({
                        templateUrl: 'common/nav/mobile-nav.html',
                        placement: 'left',
                        animation: 'am-slide-left',
                        container: 'body'
                    });
                }
            };

            this.isMobile = function () {
                return $window.navigator.userAgent.indexOf('Mobi') !== -1;
            };

            this.isMac = function () {
                return $window.navigator.appVersion.indexOf('Mac') !== -1;
            };

            this.isUUID = function (input) {
                return /[a-f0-9]{8}-?[a-f0-9]{4}-?[1-5][a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/.test(input);
            };

            this.isObject = function (element) {
                return element.type === ortolangType.object;
            };

            this.isLink = function (element) {
                return element.type === ortolangType.link;
            };

            this.isCollection = function (element) {
                return element.type === ortolangType.collection;
            };

            this.cleanResourceResponse = function (data) {
                if (data.$promise) {
                    delete data.$promise;
                }
                if (data.$resolved) {
                    delete data.$resolved;
                }
                return data;
            };

            return this;
        }]);
